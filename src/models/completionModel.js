// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

// check if a user exists by their ID
module.exports.checkUser = (data, callback) => {
    const SQL = `SELECT * FROM User WHERE user_id = ?;`;
    pool.query(SQL, [data.user_id], callback);
};

// check if a challenge exists by its ID
module.exports.checkChallenge = (data, callback) => {
    const SQL = `SELECT * FROM WellnessChallenge WHERE challenge_id = ?;`;
    pool.query(SQL, [data.challenge_id], callback);
};

// record a new challenge completion for a user
module.exports.insertCompletion = (data, callback) => {
    const SQL = `INSERT INTO UserCompletion (challenge_id, user_id, completed_at, details) VALUES (?, ?, ?, ?);`;
    pool.query(SQL, [data.challenge_id, data.user_id, data.completed_at, data.details], callback);
};

// increment user's total points by the challenge's value
module.exports.updateUserPoints = (data, callback) => {
    const SQL = `
        UPDATE User 
        SET points = points + (SELECT points FROM WellnessChallenge WHERE challenge_id = ?)
        WHERE user_id = ?;
    `;
    pool.query(SQL, [data.challenge_id, data.user_id], callback);
};

// get all completions for a challenge with field aliasing
module.exports.selectCompletionsByChallenge = (data, callback) => {
    const SQL = `
        SELECT 
            user_id, 
            details AS transmission_notes 
        FROM UserCompletion 
        WHERE challenge_id = ?;
    `;
    pool.query(SQL, [data.challenge_id], callback);
};