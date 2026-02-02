// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

// INVENTORY MANAGEMENT

// get user's inventory with item details
module.exports.getInventoryByUserId = (data, callback) => {
    const SQL = `SELECT 
                    i.inventory_id,
                    i.user_id,
                    i.item_id,
                    i.quantity,
                    i.acquired_at,
                    s.name,
                    s.description,
                    s.cost,
                    s.effect_type,
                    s.effect_duration,
                    s.image_url
                 FROM inventory i
                 JOIN shop_items s ON i.item_id = s.item_id
                 WHERE i.user_id = ?
                 ORDER BY i.acquired_at DESC;`;
    pool.query(SQL, [data.user_id], callback);
};

// check if user owns a specific item
module.exports.checkItemOwnership = (data, callback) => {
    const SQL = `SELECT quantity FROM inventory 
                 WHERE user_id = ? AND item_id = ?;`;
    pool.query(SQL, [data.user_id, data.item_id], callback);
};

// use item (decrease quantity by 1)
module.exports.useItem = (data, callback) => {
    const SQL = `UPDATE inventory 
                 SET quantity = quantity - 1 
                 WHERE user_id = ? AND item_id = ? AND quantity > 0;`;
    pool.query(SQL, [data.user_id, data.item_id], callback);
};

// delete item if quantity reaches 0
module.exports.deleteIfEmpty = (data, callback) => {
    const SQL = `DELETE FROM inventory 
                 WHERE user_id = ? AND item_id = ? AND quantity = 0;`;
    pool.query(SQL, [data.user_id, data.item_id], callback);
};

// get remaining quantity after use
module.exports.getRemainingQuantity = (data, callback) => {
    const SQL = `SELECT quantity FROM inventory 
                 WHERE user_id = ? AND item_id = ?;`;
    pool.query(SQL, [data.user_id, data.item_id], callback);
};
