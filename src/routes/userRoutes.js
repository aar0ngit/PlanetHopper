// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const jwtMiddleware = require('../middewares/jwtmiddleware');

router.get('/', jwtMiddleware.verifyToken, controller.readAllUsers);// endpoint to retrieve list of all registered users
router.get('/:user_id', jwtMiddleware.verifyToken, controller.readUserById);// endpoint to fetch a single user's details by id
router.put('/:user_id', jwtMiddleware.verifyToken, controller.updateUser);// endpoint to update existing user information

module.exports = router;