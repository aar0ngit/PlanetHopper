// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

// SHOP ITEMS

// get all shop items
module.exports.getAllShopItems = (callback) => {
    const SQL = `SELECT * FROM shop_items ORDER BY cost ASC;`;
    pool.query(SQL, callback);
};

// get shop item by ID
module.exports.getShopItemById = (data, callback) => {
    const SQL = `SELECT * FROM shop_items WHERE item_id = ?;`;
    pool.query(SQL, [data.item_id], callback);
};

// PURCHASE TRANSACTION

// check if user has enough points
module.exports.checkUserPoints = (data, callback) => {
    const SQL = `SELECT points FROM users WHERE user_id = ?;`;
    pool.query(SQL, [data.user_id], callback);
};

// deduct points from user
module.exports.deductPoints = (data, callback) => {
    const SQL = `UPDATE users SET points = points - ? WHERE user_id = ?;`;
    pool.query(SQL, [data.cost, data.user_id], callback);
};

// add item to inventory or increase quantity
module.exports.addToInventory = (data, callback) => {
    const SQL = `INSERT INTO inventory (user_id, item_id, quantity) 
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE quantity = quantity + ?;`;
    pool.query(SQL, [data.user_id, data.item_id, data.quantity, data.quantity], callback);
};

// get updated user balance
module.exports.getUserBalance = (data, callback) => {
    const SQL = `SELECT points FROM users WHERE user_id = ?;`;
    pool.query(SQL, [data.user_id], callback);
};
