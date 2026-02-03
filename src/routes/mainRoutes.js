// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();

// import individual route modules
const usersRoutes = require('./userRoutes');
const challengeRoutes = require('./challengeRoutes');
const completionRoutes = require('./completionRoutes');
const shopRoutes = require('./shopRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const planetRoutes = require('./planetRoutes');
const gameRoutes = require('./gameRoutes');

const jwtMiddleware = require('../middlewares/jwtmiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const usersController = require('../controllers/usersController');

// map user-related endpoints to /users
router.use('/users', usersRoutes);
router.use('/completion', completionRoutes);
router.use('/challenges', challengeRoutes);
router.use('/shop', shopRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/planets', planetRoutes);
router.use('/game', gameRoutes);

router.post("/login",
    usersController.login,
    bcryptMiddleware.comparePassword,
    jwtMiddleware.generateToken,
    jwtMiddleware.sendToken);
router.post("/register",
    usersController.validateRegistrationInput,
    usersController.checkUsernameExists,
    usersController.checkEmailExists,
    bcryptMiddleware.hashPassword,
    usersController.register,
    jwtMiddleware.generateToken,
    jwtMiddleware.sendToken);

module.exports = router;
