const pool = require('../services/db');

module.exports.getSettings = (data, callback) => {
    const SQL = `SELECT * FROM character_settings WHERE user_id = ?`;
    pool.query(SQL, [data.user_id], callback);
};

module.exports.checkSettingsExist = (data, callback) => {
    const SQL = `SELECT setting_id FROM character_settings WHERE user_id = ?`;
    pool.query(SQL, [data.user_id], callback);
};

module.exports.updateSettings = (data, callback) => {
    const SQL = `
        UPDATE character_settings 
        SET player_color = COALESCE(?, player_color), 
            skin_image_url = COALESCE(?, skin_image_url) 
        WHERE user_id = ?`;
    pool.query(SQL, [data.player_color, data.skin_image_url, data.user_id], callback);
};

module.exports.createSettings = (data, callback) => {
    const SQL = `
        INSERT INTO character_settings (user_id, player_color, skin_image_url) 
        VALUES (?, ?, ?)`;
    pool.query(SQL, [data.user_id, data.player_color || '#0d6efd', data.skin_image_url], callback);
};

module.exports.deleteSettings = (data, callback) => {
    const SQL = `DELETE FROM character_settings WHERE user_id = ?`;
    pool.query(SQL, [data.user_id], callback);
};
