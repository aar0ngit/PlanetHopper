// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/completionController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// PROTECTED ROUTES

// complete a challenge (middleware chain)
router.post('/challenges/:id/complete', 
  jwtMiddleware.verifyToken,
  controller.validateChallengeExists,
  controller.checkAlreadyCompleted,
  controller.insertCompletionRecord,
  controller.awardWellnessPoints,
  controller.sendCompletionResponse
);

// get my completion history
router.get('/completions/me', 
  jwtMiddleware.verifyToken, 
  controller.getMyCompletions
);

// PUBLIC ROUTES

// get completions for a specific challenge
router.get('/challenges/:challenge_id/completions', 
  controller.getCompletionsByChallenge
);

// get completion count for challenge
router.get('/challenges/:challenge_id/completions/count',
  controller.getCompletionCount
);

module.exports = router;
