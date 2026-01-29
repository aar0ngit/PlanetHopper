// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

//////////////////////////////////////
// USER AUTHENTICATION & REGISTRATION
//////////////////////////////////////

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

//////////////////////////////////////
// USER PROFILE & DATA
//////////////////////////////////////

// get user by ID (for profile, protected routes)
module.exports.selectUserById = (data, callback) => {
  const SQL = `SELECT user_id, username, email, wellness_points, combat_points, created_at 
               FROM users WHERE user_id = ?;`;
  pool.query(SQL, [data.user_id], callback);
};

// get all users (admin function)
module.exports.selectAllUsers = (callback) => {
  const SQL = `SELECT user_id, username, email, wellness_points, combat_points, created_at 
               FROM users;`;
  pool.query(SQL, callback);
};

//////////////////////////////////////
// POINTS MANAGEMENT
//////////////////////////////////////

// update wellness points (after completing challenge)
module.exports.addWellnessPoints = (data, callback) => {
  const SQL = `UPDATE users SET wellness_points = wellness_points + ? WHERE user_id = ?;`;
  pool.query(SQL, [data.points, data.user_id], callback);
};

// update combat points (after conversion)
module.exports.addCombatPoints = (data, callback) => {
  const SQL = `UPDATE users SET combat_points = combat_points + ? WHERE user_id = ?;`;
  pool.query(SQL, [data.points, data.user_id], callback);
};

// deduct wellness points (for conversion)
module.exports.deductWellnessPoints = (data, callback) => {
  const SQL = `UPDATE users SET wellness_points = wellness_points - ? WHERE user_id = ?;`;
  pool.query(SQL, [data.points, data.user_id], callback);
};

// deduct combat points (for boss fights)
module.exports.deductCombatPoints = (data, callback) => {
  const SQL = `UPDATE users SET combat_points = combat_points - ? WHERE user_id = ?;`;
  pool.query(SQL, [data.points, data.user_id], callback);
};

// convert wellness points to combat points (10:1 ratio)
module.exports.convertPoints = (data, callback) => {
  const SQL = `UPDATE users 
               SET wellness_points = wellness_points - ?, 
                   combat_points = combat_points + ? 
               WHERE user_id = ?;`;
  const wellnessToSpend = data.wellness_amount;
  const combatToReceive = Math.floor(wellnessToSpend / 10);
  pool.query(SQL, [wellnessToSpend, combatToReceive, data.user_id], callback);
};

// get user's current points (both wellness and combat)
module.exports.getUserPoints = (data, callback) => {
  const SQL = `SELECT wellness_points, combat_points FROM users WHERE user_id = ?;`;
  pool.query(SQL, [data.user_id], callback);
};
