// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

//////////////////////////////////////
// VALIDATION FUNCTIONS
//////////////////////////////////////

// check if a user exists by their ID
module.exports.checkUser = (data, callback) => {
  const SQL = `SELECT * FROM users WHERE user_id = ?;`;
  pool.query(SQL, [data.user_id], callback);
};

// check if a challenge exists by its ID
module.exports.checkChallenge = (data, callback) => {
  const SQL = `SELECT * FROM wellness_challenges WHERE challenge_id = ?;`;
  pool.query(SQL, [data.challenge_id], callback);
};

// check if user already completed a specific challenge
module.exports.checkExistingCompletion = (data, callback) => {
  const SQL = `SELECT * FROM challenge_completions 
               WHERE user_id = ? AND challenge_id = ?;`;
  pool.query(SQL, [data.user_id, data.challenge_id], callback);
};

//////////////////////////////////////
// COMPLETION OPERATIONS
//////////////////////////////////////

// record a new challenge completion for a user
module.exports.insertCompletion = (data, callback) => {
  const SQL = `INSERT INTO challenge_completions (challenge_id, user_id, points_earned) 
               VALUES (?, ?, ?);`;
  pool.query(SQL, [data.challenge_id, data.user_id, data.points_earned], callback);
};

// get all completions by a specific user (their history)
module.exports.selectCompletionsByUser = (data, callback) => {
  const SQL = `
    SELECT cc.*, wc.title, wc.description, wc.category 
    FROM challenge_completions cc
    JOIN wellness_challenges wc ON cc.challenge_id = wc.challenge_id
    WHERE cc.user_id = ?
    ORDER BY cc.completed_at DESC;
  `;
  pool.query(SQL, [data.user_id], callback);
};

// get all completions for a specific challenge (who completed it)
module.exports.selectCompletionsByChallenge = (data, callback) => {
  const SQL = `
    SELECT cc.*, u.username
    FROM challenge_completions cc
    JOIN users u ON cc.user_id = u.user_id
    WHERE cc.challenge_id = ?
    ORDER BY cc.completed_at DESC;
  `;
  pool.query(SQL, [data.challenge_id], callback);
};

// get completion count for a challenge (popularity)
module.exports.getCompletionCount = (data, callback) => {
  const SQL = `SELECT COUNT(*) as completion_count 
               FROM challenge_completions 
               WHERE challenge_id = ?;`;
  pool.query(SQL, [data.challenge_id], callback);
};

// get user's total completions count
module.exports.getUserCompletionCount = (data, callback) => {
  const SQL = `SELECT COUNT(*) as total_completions 
               FROM challenge_completions 
               WHERE user_id = ?;`;
  pool.query(SQL, [data.user_id], callback);
};

//////////////////////////////////////
// LEADERBOARD / STATS
//////////////////////////////////////

// get top users by completion count
module.exports.getTopUsers = (callback) => {
  const SQL = `
    SELECT u.user_id, u.username, COUNT(cc.completion_id) as total_completions
    FROM users u
    LEFT JOIN challenge_completions cc ON u.user_id = cc.user_id
    GROUP BY u.user_id
    ORDER BY total_completions DESC
    LIMIT 10;
  `;
  pool.query(SQL, callback);
};

// get most popular challenges
module.exports.getMostPopularChallenges = (callback) => {
  const SQL = `
    SELECT wc.*, COUNT(cc.completion_id) as completion_count
    FROM wellness_challenges wc
    LEFT JOIN challenge_completions cc ON wc.challenge_id = cc.challenge_id
    GROUP BY wc.challenge_id
    ORDER BY completion_count DESC
    LIMIT 10;
  `;
  pool.query(SQL, callback);
};
