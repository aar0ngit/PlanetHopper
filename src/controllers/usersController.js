// P2509361
// Aaron Tan
// DIT/FT/1B/08

const model = require('../models/userModel');
const jwt = require('jsonwebtoken');

// AUTHENTICATION

// register new user
module.exports.register = (req, res, next) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    password_hash: res.locals.hash // from bcrypt
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error insertUser:", error);
      return res.status(500).json({ message: "Database error" });
    }
    
    res.locals.userId = results.insertId;
    res.locals.message = "User registered successfully";
    next(); // proceed to generate JWT token
  };

  model.insertUser(data, callback);
};

// login user
module.exports.login = (req, res, next) => {
  const data = {
    username: req.body.username
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error getUserByUsername:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // store hash and userId for next middleware
    res.locals.hash = results[0].password_hash;
    res.locals.userId = results[0].user_id;
    res.locals.message = "Login successful";
    next(); // Proceed to comparePassword
  };

  model.getUserByUsername(data, callback);
};

// validate registration input
module.exports.validateRegistrationInput = (req, res, next) => {
    if (!req.body.username || !req.body.email) {
        return res.status(400).json({ message: "Username and email required" });
    }
    next();
};

// check if username exists
module.exports.checkUsernameExists = (req, res, next) => {
    const data = { username: req.body.username };

    const callback = (error, results) => {
        if (error) {
            console.error("Error checkUsername:", error);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: "Username already exists" });
        }
        next();
    };

    model.checkUsername(data, callback);
};

// check if email exists
module.exports.checkEmailExists = (req, res, next) => {
    const data = { email: req.body.email };

    const callback = (error, results) => {
        if (error) {
            console.error("Error checkEmail:", error);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }
        next();
    };

    model.checkEmail(data, callback);
};


// USER PROFILE

// Get user profile (protected)
module.exports.getUserProfile = (req, res) => {
  const data = {
    user_id: res.locals.userId // From JWT token
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error selectUserById:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results[0]);
  };

  model.selectUserById(data, callback);
};

// Get user by ID (admin/public)
module.exports.readUserById = (req, res) => {
  const data = {
    user_id: req.params.user_id
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error selectUserById:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results[0]);
  };

  model.selectUserById(data, callback);
};

// Get all users (admin)
module.exports.readAllUsers = (req, res) => {
  const callback = (error, results) => {
    if (error) {
      console.error("Error selectAllUsers:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  };

  model.selectAllUsers(callback);
};

// POINTS MANAGEMENT

// Get user's points balance
module.exports.getUserPoints = (req, res) => {
  const data = {
    user_id: res.locals.userId
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error getUserPoints:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results[0]);
  };

  model.getUserPoints(data, callback);
};


