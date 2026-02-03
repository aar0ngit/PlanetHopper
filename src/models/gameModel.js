// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

// GAME SESSION MANAGEMENT

// create new game session
module.exports.createGameSession = (data, callback) => {
    const SQL = `INSERT INTO game_sessions 
                    (user_id, planet_id, start_time)
                 VALUES (?, ?, NOW());`;
    pool.query(SQL, [data.user_id, data.planet_id], callback);
};

// get game session by ID
module.exports.getGameSession = (data, callback) => {
    const SQL = `SELECT 
                    session_id,
                    user_id,
                    planet_id,
                    start_time,
                    end_time,
                    result,
                    hits_taken,
                    time_elapsed_seconds,
                    is_valid
                 FROM game_sessions
                 WHERE session_id = ?;`;
    pool.query(SQL, [data.session_id], callback);
};

// increment hit count
module.exports.incrementHitCount = (data, callback) => {
    const SQL = `UPDATE game_sessions 
                 SET hits_taken = hits_taken + 1
                 WHERE session_id = ?;`;
    pool.query(SQL, [data.session_id], callback);
};

// get current hit count
module.exports.getHitCount = (data, callback) => {
    const SQL = `SELECT hits_taken, start_time
                 FROM game_sessions
                 WHERE session_id = ?;`;
    pool.query(SQL, [data.session_id], callback);
};

// complete game session (win)
module.exports.completeGameSession = (data, callback) => {
    const SQL = `UPDATE game_sessions 
                 SET end_time = NOW(),
                     result = 'win',
                     time_elapsed_seconds = ?,
                     hits_taken = ?
                 WHERE session_id = ?;`;
    pool.query(SQL, [data.time_elapsed, data.hits_taken, data.session_id], callback);
};

// fail game session (loss)
module.exports.failGameSession = (data, callback) => {
    const SQL = `UPDATE game_sessions 
                 SET end_time = NOW(),
                     result = 'loss',
                     time_elapsed_seconds = ?,
                     hits_taken = ?
                 WHERE session_id = ?;`;
    pool.query(SQL, [data.time_elapsed, data.hits_taken, data.session_id], callback);
};

// abandon game session
module.exports.abandonGameSession = (data, callback) => {
    const SQL = `UPDATE game_sessions 
                 SET end_time = NOW(),
                     result = 'abandoned'
                 WHERE session_id = ?;`;
    pool.query(SQL, [data.session_id], callback);
};

// validate session is active (not ended)
module.exports.validateActiveSession = (data, callback) => {
    const SQL = `SELECT session_id, user_id, planet_id, start_time
                 FROM game_sessions
                 WHERE session_id = ? AND end_time IS NULL;`;
    pool.query(SQL, [data.session_id], callback);
};

// mark session as invalid (anti-cheat)
module.exports.markSessionInvalid = (data, callback) => {
    const SQL = `UPDATE game_sessions 
                 SET is_valid = FALSE
                 WHERE session_id = ?;`;
    pool.query(SQL, [data.session_id], callback);
};

// get user's game history for a planet
module.exports.getUserPlanetHistory = (data, callback) => {
    const SQL = `SELECT 
                    session_id,
                    start_time,
                    end_time,
                    result,
                    hits_taken,
                    time_elapsed_seconds,
                    is_valid
                 FROM game_sessions
                 WHERE user_id = ? AND planet_id = ?
                 ORDER BY start_time DESC
                 LIMIT 10;`;
    pool.query(SQL, [data.user_id, data.planet_id], callback);
};
