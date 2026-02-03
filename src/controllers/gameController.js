// P2509361
// Aaron Tan
// DIT/FT/1B/08

const planetModel = require('../models/planetModel');

// START GAME

// Initialize Game
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

// send Game Data
module.exports.sendGameData = (req, res) => {
    res.status(200).json({
        message: "Game started",
        planetData: res.locals.planetData,
        obstacles: res.locals.obstacles,
        loadout: req.body.loadout || []
    });
};


// COMPLETE GAME

// Validate Completion Params
module.exports.validateCompleteParams = (req, res, next) => {
    const { planet_id, time_elapsed } = req.body;

    if (!planet_id || time_elapsed === undefined) {
        return res.status(400).json({ message: "planet_id and time_elapsed are required" });
    }

    res.locals.planetId = planet_id;
    next();
};

// update User Progress
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

// fetch Next Planet
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

// unlock If Available
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

// send Complete Response
module.exports.sendCompleteResponse = (req, res) => {
    const { time_elapsed } = req.body;

    res.status(200).json({
        message: res.locals.gameCompleted ? "Congratulations! You completed the final planet!" : "Level complete!",
        success: true,
        time_elapsed: time_elapsed,
        nextPlanetUnlocked: res.locals.nextPlanetUnlocked,
        gameCompleted: res.locals.gameCompleted
    });
};
