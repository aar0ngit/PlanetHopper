// P2509361
// Aaron Tan
// DIT/FT/1B/08

const planetModel = require('../models/planetModel');
const userModel = require('../models/userModel');

// START GAME

// initialize game
module.exports.initGameParams = (req, res, next) => {
    const { planet_id } = req.body;

    if (!planet_id) {
        return res.status(400).json({ message: "planet_id is required" });
    }

    res.locals.planetId = planet_id;
    next();
};

// fetch planet details
module.exports.fetchPlanetDetails = (req, res, next) => {
    const planet_id = res.locals.planetId;

    const callback = (error, results) => {
        if (error) {
            console.error("Error getPlanetById:", error);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Planet not found" });
        }
        res.locals.planetData = results[0];
        next();
    };

    planetModel.getPlanetById({ planet_id }, callback);
};

// fetch obstacles
module.exports.fetchObstacles = (req, res, next) => {
    const planet_id = res.locals.planetId;

    const callback = (error, results) => {
        if (error) {
            console.error("Error getPlanetObstacles:", error);
            return res.status(500).json({ message: "Database error" });
        }
        res.locals.obstacles = results;
        next();
    };

    planetModel.getPlanetObstacles({ planet_id }, callback);
};

// send game data
module.exports.sendGameData = (req, res) => {
    const characterModel = require('../models/characterModel');
    const jwt = require('jsonwebtoken');

    // create a temporary game token
    const gamePayload = {
        planet_id: res.locals.planetId,
        start_time: Date.now()
    };

    // sign with a secret
    const gameToken = jwt.sign(gamePayload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // fetch character settings
    const callback = (err, results) => {
        let character = null;
        if (!err && results && results.length > 0) {
            character = results[0];
        }

        res.status(200).json({
            message: "Game started",
            planetData: res.locals.planetData,
            obstacles: res.locals.obstacles,
            loadout: req.body.loadout || [],
            character: character,
            game_token: gameToken // send token to client
        });
    };

    characterModel.getSettings({ user_id: res.locals.userId }, callback);
};

// COMPLETE GAME

// validate completion params
module.exports.validateCompleteParams = (req, res, next) => {
    const { planet_id, time_elapsed } = req.body;

    if (!planet_id || time_elapsed === undefined) {
        return res.status(400).json({ message: "planet_id and time_elapsed are required" });
    }

    res.locals.planetId = planet_id;
    next();
};

// update user progress
module.exports.updateProgress = (req, res, next) => {
    const { time_elapsed } = req.body;
    const planet_id = res.locals.planetId;

    const data = {
        user_id: res.locals.userId,
        planet_id: planet_id,
        time_elapsed: time_elapsed
    };

    const callback = (error) => {
        if (error) console.error("Error updatePlanetCompletion:", error);
        next();
    };

    planetModel.updatePlanetCompletion(data, callback);
};

// fetch next planet
module.exports.fetchNextPlanet = (req, res, next) => {
    const planet_id = res.locals.planetId;

    const callback = (error, results) => {
        if (error) console.error("Error getNextPlanetId:", error);

        if (results && results.length > 0) {
            res.locals.nextPlanetId = results[0].planet_id;
        }
        next();
    };

    planetModel.getNextPlanetId({ planet_id }, callback);
};

// unlock if available
module.exports.unlockIfAvailable = (req, res, next) => {
    const next_planet_id = res.locals.nextPlanetId;

    res.locals.nextPlanetUnlocked = false;

    if (next_planet_id) {
        const callback = (error) => {
            if (error) console.error("Error unlockNextPlanet:", error);
            else res.locals.nextPlanetUnlocked = true;
            next();
        };

        planetModel.unlockNextPlanet({
            user_id: res.locals.userId,
            next_planet_id
        }, callback);
    } else {
        // game completed
        res.locals.gameCompleted = true;
        next();
    }
};

// reward points
module.exports.rewardCompletionPoints = (req, res, next) => {
    const planet_id = parseInt(res.locals.planetId);

    // map planet to points
    const pointsMap = {
        1: 20,
        2: 40,
        3: 60,
        4: 80,
        5: 100
    };

    const points = pointsMap[planet_id] || 25;
    res.locals.pointsEarned = points;

    const data = {
        user_id: res.locals.userId,
        points: points
    };

    const callback = (error) => {
        if (error) {
            console.error("Error adding points:", error);
        }
        next();
    };

    userModel.addPoints(data, callback);
};

// send complete response
module.exports.sendCompleteResponse = (req, res) => {
    const { time_elapsed } = req.body;

    res.status(200).json({
        message: res.locals.gameCompleted ? "Congratulations! You completed the final planet!" : "Level complete!",
        success: true,
        time_elapsed: time_elapsed,
        points_earned: res.locals.pointsEarned,
        nextPlanetUnlocked: res.locals.nextPlanetUnlocked,
        gameCompleted: res.locals.gameCompleted
    });
};
