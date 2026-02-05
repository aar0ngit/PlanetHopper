// P2509361
// Aaron Tan
// DIT/FT/1B/08

const planetModel = require('../models/planetModel');

// PLANET ENDPOINTS

// fetch user progress
module.exports.fetchUserProgress = (req, res, next) => {
    const data = {
        user_id: res.locals.userId
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getAllPlanetsWithProgress:", error);
            return res.status(500).json({ message: "Database error" });
        }
        res.locals.planets = results;
        next();
    };

    planetModel.getUserPlanetProgress(data, callback);
};

// send planets response
module.exports.sendPlanetsResponse = (req, res) => {
    res.status(200).json(res.locals.planets);
};

// fetch single planet
module.exports.fetchPlanetById = (req, res, next) => {
    const data = {
        planet_id: req.params.planet_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getPlanetById:", error);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Planet not found" });
        }

        res.locals.planet = results[0];
        next();
    };

    planetModel.getPlanetById(data, callback);
};

// send planet response
module.exports.sendPlanetResponse = (req, res) => {
    res.status(200).json(res.locals.planet);
};

// fetch planet obstacles
module.exports.fetchPlanetObstacles = (req, res, next) => {
    const data = {
        planet_id: req.params.planet_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getPlanetObstacles:", error);
            return res.status(500).json({ message: "Database error" });
        }
        res.locals.obstacles = results;
        next();
    };

    planetModel.getPlanetObstacles(data, callback);
};

// send obstacles response
module.exports.sendObstaclesResponse = (req, res) => {
    res.status(200).json(res.locals.obstacles);
};

// validate planet is unlocked for user
module.exports.validatePlanetUnlocked = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        planet_id: req.body.planet_id || req.params.planet_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error validatePlanetUnlocked:", error);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(403).json({
                message: "Planet not unlocked",
                hint: "Complete previous planets to unlock this one"
            });
        }

        if (!results[0].is_unlocked) {
            return res.status(403).json({
                message: "Planet not unlocked",
                hint: "Complete previous planets to unlock this one"
            });
        }

        next();
    };

    planetModel.checkPlanetUnlocked(data, callback);
};

// fetch planet leaderboard
module.exports.fetchLeaderboard = (req, res, next) => {
    const data = {
        planet_id: req.params.planet_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getPlanetLeaderboard:", error);
            return res.status(500).json({ message: "Database error" });
        }
        res.locals.leaderboard = results;
        next();
    };

    planetModel.getPlanetLeaderboard(data, callback);
};

// send leaderboard response
module.exports.sendLeaderboardResponse = (req, res) => {
    res.status(200).json(res.locals.leaderboard);
};
