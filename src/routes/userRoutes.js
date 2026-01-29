// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');

//////////////////////////////////////
// PUBLIC ROUTES (No JWT)
//////////////////////////////////////

// register new user
router.post('/register', 
  controller.checkUsernameOrEmailExist,
  bcryptMiddleware.hashPassword,
  controller.register,
  jwtMiddleware.generateToken,
  jwtMiddleware.sendToken
);

// login user
router.post('/login',
  controller.login,
  bcryptMiddleware.comparePassword,
  jwtMiddleware.generateToken,
  jwtMiddleware.sendToken
);

//////////////////////////////////////
// PROTECTED ROUTES (JWT Required)
//////////////////////////////////////

// get own profile
router.get('/profile', 
  jwtMiddleware.verifyToken, 
  controller.getUserProfile
);

// get own points balance
router.get('/points', 
  jwtMiddleware.verifyToken, 
  controller.getUserPoints
);

// convert wellness points to combat points
router.post('/convert', 
  jwtMiddleware.verifyToken, 
  controller.convertPoints
);

// get all users (admin)
router.get('/', 
  jwtMiddleware.verifyToken, 
  controller.readAllUsers
);

// get specific user by ID
router.get('/:user_id', 
  jwtMiddleware.verifyToken, 
  controller.readUserById
);

module.exports = router;
