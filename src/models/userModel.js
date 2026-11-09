// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

// USER AUTHENTICATION & REGISTRATION

// register new user with hashed password
module.exports.insertUser = (data, callback) => {
    const SQL = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);`;
    const VALUES = [data.username, data.email, data.password_hash];
    pool.query(SQL, VALUES, callback);
};

// get user by username (for login)
module.exports.getUserByUsername = (data, callback) => {
    const SQL = `SELECT * FROM users WHERE username = ?;`;
    const VALUES = [data.username];
    pool.query(SQL, VALUES, callback);
};

// get user by email (for login/check)
module.exports.getUserByEmail = (data, callback) => {
    const SQL = `SELECT * FROM users WHERE email = ?;`;
    const VALUES = [data.email];
    pool.query(SQL, VALUES, callback);
};

// check if username exists
module.exports.checkUsername = (data, callback) => {
    const SQL = `SELECT * FROM users WHERE username = ?;`;
    const VALUES = [data.username];
    pool.query(SQL, VALUES, callback);
};

// check if email exists
module.exports.checkEmail = (data, callback) => {
    const SQL = `SELECT * FROM users WHERE email = ?;`;
    const VALUES = [data.email];
    pool.query(SQL, VALUES, callback);
};

// USER PROFILE & DATA

// get user by ID (for profile, protected routes)
module.exports.selectUserById = (data, callback) => {
    const SQL = `SELECT user_id, username, email, points, created_at 
                 FROM users WHERE user_id = ?;`;
    pool.query(SQL, [data.user_id], callback);
};

// public view of another user (no email)
module.exports.selectPublicUserById = (data, callback) => {
    const SQL = `SELECT user_id, username, points, created_at
                 FROM users WHERE user_id = ?;`;
    pool.query(SQL, [data.user_id], callback);
};

// guest account: random name, unusable password, starter credits
module.exports.insertGuestUser = (data, callback) => {
    const SQL = `INSERT INTO users (username, email, password_hash, points) VALUES (?, ?, ?, ?);`;
    pool.query(SQL, [data.username, data.email, data.password_hash, data.points], callback);
};

// get all users (admin function)
module.exports.selectAllUsers = (callback) => {
    const SQL = `SELECT user_id, username, points, created_at
                 FROM users;`;
    pool.query(SQL, callback);
};

// POINTS MANAGEMENT

module.exports.addPoints = (data, callback) => {
    const SQL = `UPDATE users SET points = points + ? WHERE user_id = ?;`;
    pool.query(SQL, [data.points, data.user_id], callback);
};

module.exports.deductPoints = (data, callback) => {
    const SQL = `UPDATE users SET points = points - ? WHERE user_id = ?;`;
    pool.query(SQL, [data.points, data.user_id], callback);
};

module.exports.getUserPoints = (data, callback) => {
    const SQL = `SELECT points FROM users WHERE user_id = ?;`;
    pool.query(SQL, [data.user_id], callback);
};