// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
const mainRoutes = require('./routes/mainRoutes');
app.use('/', mainRoutes);

module.exports = app;