// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// on Vercel, public/ is served by the CDN, so send the site root to the home page
app.get('/', (req, res) => res.redirect('/index.html'));



// Routes
const mainRoutes = require('./routes/mainRoutes');
app.use('/api', mainRoutes);

module.exports = app;