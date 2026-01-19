// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/completionController');

router.post('/:challenge_id/', controller.validateUser, controller.validateChallenge, controller.completeChallenge);// endpoint to log a completion with middleware for user and challenge validation
router.get('/:challenge_id/', controller.readCompletionsByChallenge);// endpoint to retrieve all completions for a specific challenge

module.exports = router;