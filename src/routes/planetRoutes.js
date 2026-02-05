// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/planetController');
const jwtMiddleware = require('../middlewares/jwtmiddleware');

// PROTECTED ROUTES (JWT Required)

// GET /api/planets
router.get('/',
    jwtMiddleware.verifyToken,
    controller.fetchUserProgress,
    controller.sendPlanetsResponse
);

// GET /api/planets/:planet_id
router.get('/:planet_id',
    jwtMiddleware.verifyToken,
    controller.fetchPlanetById,
    controller.sendPlanetResponse
);

// GET /api/planets/:planet_id/obstacles
router.get('/:planet_id/obstacles',
    jwtMiddleware.verifyToken,
    controller.fetchPlanetObstacles,
    controller.sendObstaclesResponse
);

// GET /api/planets/:planet_id/leaderboard
router.get('/:planet_id/leaderboard',
    jwtMiddleware.verifyToken,
    controller.fetchLeaderboard,
    controller.sendLeaderboardResponse
);

module.exports = router;
