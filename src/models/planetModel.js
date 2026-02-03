// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

// PLANET MANAGEMENT

// get all planets
module.exports.getAllPlanets = (callback) => {
    const SQL = `SELECT 
                    planet_id,
                    name,
                    theme,
                    speed,
                    duration_seconds,
                    background_image,
                    music_file,
                    description,
                    order_index
                 FROM planets
                 ORDER BY order_index ASC;`;
    pool.query(SQL, callback);
};

// get planet by ID
module.exports.getPlanetById = (data, callback) => {
    const SQL = `SELECT 
                    planet_id,
                    name,
                    theme,
                    speed,
                    duration_seconds,
                    background_image,
                    music_file,
                    description,
                    order_index
                 FROM planets
                 WHERE planet_id = ?;`;
    pool.query(SQL, [data.planet_id], callback);
};

// get planet obstacles
module.exports.getPlanetObstacles = (data, callback) => {
    const SQL = `SELECT 
                    obstacle_id,
                    planet_id,
                    obstacle_type,
                    position_x
                 FROM planet_obstacles
                 WHERE planet_id = ?
                 ORDER BY position_x ASC;`;
    pool.query(SQL, [data.planet_id], callback);
};

// USER PLANET PROGRESS

// get user's planet progress (all planets with unlock status)
module.exports.getUserPlanetProgress = (data, callback) => {
    const SQL = `SELECT 
                    p.planet_id,
                    p.name,
                    p.theme,
                    p.speed,
                    p.duration_seconds,
                    p.background_image,
                    p.music_file,
                    p.description,
                    p.order_index,
                    COALESCE(upp.is_unlocked, FALSE) as is_unlocked,
                    COALESCE(upp.times_completed, 0) as times_completed,
                    upp.best_time_seconds,
                    upp.last_played_at
                 FROM planets p
                 LEFT JOIN user_planet_progress upp 
                    ON p.planet_id = upp.planet_id AND upp.user_id = ?
                 ORDER BY p.order_index ASC;`;
    pool.query(SQL, [data.user_id], callback);
};

// check if planet is unlocked for user
module.exports.checkPlanetUnlocked = (data, callback) => {
    const SQL = `SELECT is_unlocked 
                 FROM user_planet_progress
                 WHERE user_id = ? AND planet_id = ?;`;
    pool.query(SQL, [data.user_id, data.planet_id], callback);
};

// unlock next planet for user
module.exports.unlockNextPlanet = (data, callback) => {
    const SQL = `INSERT INTO user_planet_progress (user_id, planet_id, is_unlocked)
                 VALUES (?, ?, TRUE)
                 ON DUPLICATE KEY UPDATE is_unlocked = TRUE;`;
    pool.query(SQL, [data.user_id, data.next_planet_id], callback);
};

// update planet completion stats
module.exports.updatePlanetCompletion = (data, callback) => {
    const SQL = `INSERT INTO user_planet_progress 
                    (user_id, planet_id, is_unlocked, times_completed, best_time_seconds, last_played_at)
                 VALUES (?, ?, TRUE, 1, ?, NOW())
                 ON DUPLICATE KEY UPDATE 
                    times_completed = times_completed + 1,
                    best_time_seconds = LEAST(COALESCE(best_time_seconds, ?), ?),
                    last_played_at = NOW();`;
    pool.query(SQL, [
        data.user_id,
        data.planet_id,
        data.time_elapsed,
        data.time_elapsed,
        data.time_elapsed
    ], callback);
};

// get next planet ID
module.exports.getNextPlanetId = (data, callback) => {
    const SQL = `SELECT planet_id 
                 FROM planets 
                 WHERE order_index = (
                    SELECT order_index + 1 
                    FROM planets 
                    WHERE planet_id = ?
                 );`;
    pool.query(SQL, [data.planet_id], callback);
};
