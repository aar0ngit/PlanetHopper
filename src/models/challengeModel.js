// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

// create a new wellness challenge in the database
module.exports.insertChallenge = (data, callback) => {
    const SQL = `INSERT INTO WellnessChallenge (creator_id, description, points) VALUES (?, ?, ?);`;
    pool.query(SQL, [data.user_id, data.description, data.points], callback);
};

// retrieve all available wellness challenges
module.exports.selectAllChallenges = (callback) => {
    const SQL = `SELECT * FROM WellnessChallenge;`;
    pool.query(SQL, callback);
};

// find a specific challenge using its unique ID
module.exports.selectChallengeById = (data, callback) => {
    const SQL = `SELECT * FROM WellnessChallenge WHERE challenge_id = ?;`;
    pool.query(SQL, [data.challenge_id], callback);
};

// update the description or points of an existing challenge
module.exports.updateChallenge = (data, callback) => {
    const SQL = `UPDATE WellnessChallenge SET description = ?, points = ? WHERE challenge_id = ?;`;
    pool.query(SQL, [data.description, data.points, data.challenge_id], callback);
};

// remove a challenge from the database by ID
module.exports.deleteChallenge = (data, callback) => {
    const SQL = `DELETE FROM WellnessChallenge WHERE challenge_id = ?;`;
    pool.query(SQL, [data.challenge_id], callback);
};