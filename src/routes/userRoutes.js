// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');

router.post('/', controller.checkUsernameExists, controller.createNewUser);// endpoint to register a new user with duplicate username check
router.get('/', controller.readAllUsers);// endpoint to retrieve list of all registered users
router.get('/:user_id', controller.readUserById);// endpoint to fetch a single user's details by id
router.put('/:user_id', controller.updateUser);// endpoint to update existing user information

module.exports = router;