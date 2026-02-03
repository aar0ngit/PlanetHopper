// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/completionController');
const jwtMiddleware = require('../middlewares/jwtmiddleware');

// PROTECTED ROUTES

// complete a challenge
// POST /api/completion/:id
router.post('/:id',
  jwtMiddleware.verifyToken,
  controller.validateChallengeExists,
  controller.checkAlreadyCompleted,
  controller.insertCompletionRecord,
  controller.awardWellnessPoints,
  controller.sendCompletionResponse
);

// get my completion history
// GET /api/completion/me
router.get('/me',
  jwtMiddleware.verifyToken,
  controller.getMyCompletions
);

// PUBLIC ROUTES

// get completions for a specific challenge
// GET /api/completion/:challenge_id
router.get('/:challenge_id',
  controller.getCompletionsByChallenge
);

// get completion count for challenge
// GET /api/completion/:challenge_id/count
router.get('/:challenge_id/count',
  controller.getCompletionCount
);

module.exports = router;
