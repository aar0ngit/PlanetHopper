// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
// import individual route modules
const usersRoutes = require('./userRoutes');
const challengeRoutes = require('./challengeRoutes');
const completionRoutes = require('./completionRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const jwtMiddleware = require('../middewares/jwtmiddleware');
const bcryptMiddleware = require('../middewares/bcryptMiddleware');
const usersController = require('../controllers/usersController');
// map user-related endpoints to /users
router.use('/users', usersRoutes);
router.use('/challenges', completionRoutes); 
router.use('/challenges', challengeRoutes);
router.use('/inventory', inventoryRoutes);
router.post("/login", usersController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/register", usersController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, usersController.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
module.exports = router;