// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameController');
const planetController = require('../controllers/planetController');
const jwtMiddleware = require('../middlewares/jwtmiddleware');

// PROTECTED ROUTES (JWT Required)

// POST /api/game/start
router.post('/start',
    jwtMiddleware.verifyToken,
    planetController.validatePlanetUnlocked,
    controller.initGameParams,
    controller.fetchPlanetDetails,
    controller.fetchObstacles,
    controller.sendGameData
);

// POST /api/game/complete
router.post('/complete',
    jwtMiddleware.verifyToken,
    controller.validateCompleteParams,
    controller.updateProgress,
    controller.fetchNextPlanet,
    controller.unlockIfAvailable,
    controller.sendCompleteResponse
);

module.exports = router;
