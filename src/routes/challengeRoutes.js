// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/challengeController');
const jwtMiddleware = require('../middlewares/jwtmiddleware');

// PUBLIC ROUTES

// get all challenges
router.get('/', controller.getAllChallenges);

// search challenges
router.get('/search', controller.searchChallenges);

// get challenges by category
// get specific challenge
router.get('/:id', controller.getChallengeById);

// PROTECTED ROUTES

// create new challenge
router.post('/',
  jwtMiddleware.verifyToken,
  controller.createChallenge
);

// get my created challenges
router.get('/user/me',
  jwtMiddleware.verifyToken,
  controller.getMyChallenges
);

// delete challenge (only creator)
router.delete('/:id',
  jwtMiddleware.verifyToken,
  controller.deleteChallenge
);

module.exports = router;
