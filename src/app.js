// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



// Routes
const mainRoutes = require('./routes/mainRoutes');
app.use('/api', mainRoutes);

module.exports = app;