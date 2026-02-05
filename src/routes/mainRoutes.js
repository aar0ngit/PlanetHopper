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
const characterRoutes = require('./characterRoutes');

// map user-related endpoints to /users
router.use('/users', usersRoutes);
router.use('/completion', completionRoutes);
router.use('/challenges', challengeRoutes);
router.use('/shop', shopRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/planets', planetRoutes);
router.use('/game', gameRoutes);
router.use('/character', characterRoutes);

module.exports = router;
