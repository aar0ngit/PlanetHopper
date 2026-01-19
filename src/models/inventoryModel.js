// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

// inserts a new cosmic item record linked to a specific user
module.exports.insertItem = (data, callback) => {
    const SQL = `INSERT INTO CosmicInventory (user_id, item_name, rarity) VALUES (?, ?, ?);`;
    pool.query(SQL, [data.user_id, data.item_name, data.rarity], callback);
};

// fetches all items belonging to a user from the inventory table
module.exports.selectInventoryByUser = (data, callback) => {
    const SQL = `SELECT * FROM CosmicInventory WHERE user_id = ?;`;
    pool.query(SQL, [data.user_id], callback);
};