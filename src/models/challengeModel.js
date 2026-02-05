// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

// CHALLENGE CRUD OPERATIONS

// greate a new wellness challenge
module.exports.insertChallenge = (data, callback) => {
  const SQL = `INSERT INTO wellness_challenges (title, description, points_value, created_by) 
               VALUES (?, ?, ?, ?);`;
  pool.query(SQL, [data.title, data.description, data.points_value, data.created_by], callback);
};

// get all wellness challenges
module.exports.selectAllChallenges = (callback) => {
  const SQL = `SELECT wc.*, u.username as creator_name 
               FROM wellness_challenges wc
               JOIN users u ON wc.created_by = u.user_id
               ORDER BY wc.created_at DESC;`;
  pool.query(SQL, callback);
};

// get a specific challenge by ID
module.exports.selectChallengeById = (data, callback) => {
  const SQL = `SELECT wc.*, u.username as creator_name 
               FROM wellness_challenges wc
               JOIN users u ON wc.created_by = u.user_id
               WHERE wc.challenge_id = ?;`;
  pool.query(SQL, [data.challenge_id], callback);
};

// gwet challenges created by specific user
module.exports.selectChallengesByUser = (data, callback) => {
  const SQL = `SELECT * FROM wellness_challenges WHERE created_by = ?;`;
  pool.query(SQL, [data.user_id], callback);
};

// update a challenge (only by creator)
module.exports.updateChallenge = (data, callback) => {
  const SQL = `UPDATE wellness_challenges 
               SET title = ?, description = ?, points_value = ? 
               WHERE challenge_id = ? AND created_by = ?;`;
  pool.query(SQL, [data.title, data.description, data.points_value, data.challenge_id, data.created_by], callback);
};

// delete a challenge (only by creator)
module.exports.deleteChallenge = (data, callback) => {
  const SQL = `DELETE FROM wellness_challenges 
               WHERE challenge_id = ? AND created_by = ?;`;
  pool.query(SQL, [data.challenge_id, data.created_by], callback);
};

// search challenges by title
module.exports.searchChallenges = (data, callback) => {
  const SQL = `SELECT wc.*, u.username as creator_name 
               FROM wellness_challenges wc
               JOIN users u ON wc.created_by = u.user_id
               WHERE wc.title LIKE ? OR wc.description LIKE ?
               ORDER BY wc.created_at DESC;`;
  const searchTerm = `%${data.search}%`;
  pool.query(SQL, [searchTerm, searchTerm], callback);
};
