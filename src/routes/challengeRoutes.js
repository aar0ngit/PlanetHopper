// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/challengeController');

router.post('/', controller.createChallenge);// endpoint to create a new wellness challenge
router.get('/', controller.readAllChallenges);// endpoint to fetch the list of all challenges
router.put('/:challenge_id', controller.updateChallenge);// endpoint to modify an existing challenge by its id
router.delete('/:challenge_id', controller.deleteChallenge);// endpoint to permanently remove a challenge from the database

module.exports = router;