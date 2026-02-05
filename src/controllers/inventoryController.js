// P2509361
// Aaron Tan
// DIT/FT/1B/08

const model = require('../models/inventoryModel');

// INVENTORY MANAGEMENT

// get user's inventory
module.exports.getUserInventory = (req, res) => {
    const data = {
        user_id: req.params.user_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getInventoryByUserId:", error);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json(results);
    };

    model.getInventoryByUserId(data, callback);
};

// validate use input
module.exports.validateUseInput = (req, res, next) => {
    const { item_id } = req.body;

    if (!item_id) {
        return res.status(400).json({ message: "item_id is required" });
    }

    next();
};

// check item ownership
module.exports.checkOwnership = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        item_id: req.body.item_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error checkItemOwnership:", error);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0 || results[0].quantity < 1) {
            return res.status(400).json({ message: "Item not owned or out of stock" });
        }

        next();
    };

    model.checkItemOwnership(data, callback);
};

// decrease quantity
module.exports.decreaseQuantity = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        item_id: req.body.item_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error useItem:", error);
            return res.status(500).json({ message: "Failed to use item" });
        }

        next();
    };

    model.useItem(data, callback);
};

// cleanup empty items
module.exports.cleanupEmptyItems = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        item_id: req.body.item_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleteIfEmpty:", error);
        }
        next();
    };

    model.deleteIfEmpty(data, callback);
};

// send response
module.exports.completeUse = (req, res) => {
    const data = {
        user_id: res.locals.userId,
        item_id: req.body.item_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getRemainingQuantity:", error);
            return res.status(500).json({ message: "Database error" });
        }

        const remaining = results.length > 0 ? results[0].quantity : 0;

        res.status(200).json({
            message: "Item used successfully",
            remaining_quantity: remaining
        });
    };

    model.getRemainingQuantity(data, callback);
};
