// P2509361
// Aaron Tan
// DIT/FT/1B/08

const model = require('../models/shopModel');

// SHOP ITEMS

// get all shop items
module.exports.getAllItems = (req, res) => {
    const callback = (error, results) => {
        if (error) {
            console.error("Error getAllShopItems:", error);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json(results);
    };
    model.getAllShopItems(callback);
};

// get shop item by id
module.exports.getItemById = (req, res) => {
    const data = {
        item_id: req.params.item_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getShopItemById:", error);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(results[0]);
    };

    model.getShopItemById(data, callback);
};

// PURCHASE TRANSACTION

// validate item and calculate cost
module.exports.validateItem = (req, res, next) => {
    const data = {
        item_id: req.body.item_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getShopItemById:", error);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.locals.item = results[0];
        res.locals.quantity = req.body.quantity || 1;
        res.locals.totalCost = results[0].cost * res.locals.quantity;
        next();
    };

    model.getShopItemById(data, callback);
};

// check if user has enough points
module.exports.checkPoints = (req, res, next) => {
    const data = {
        user_id: res.locals.userId
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error checkUserPoints:", error);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const userPoints = results[0].points;

        if (userPoints < res.locals.totalCost) {
            return res.status(400).json({
                message: "Insufficient points",
                required: res.locals.totalCost,
                available: userPoints
            });
        }

        next();
    };

    model.checkUserPoints(data, callback);
};

// deduct points from user balance
module.exports.deductPoints = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        cost: res.locals.totalCost
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error deductPoints:", error);
            return res.status(500).json({ message: "Failed to deduct points" });
        }

        next();
    };

    model.deductPoints(data, callback);
};

// add purchased item to inventory
module.exports.addToInventory = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        item_id: req.body.item_id,
        quantity: res.locals.quantity
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error addToInventory:", error);
            return res.status(500).json({ message: "Failed to add to inventory" });
        }

        next();
    };

    model.addToInventory(data, callback);
};

// get updated balance and return response
module.exports.completePurchase = (req, res) => {
    const data = {
        user_id: res.locals.userId
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error getUserBalance:", error);
            return res.status(500).json({ message: "Database error" });
        }

        res.status(200).json({
            message: "Purchase successful",
            item_name: res.locals.item.name,
            quantity: res.locals.quantity,
            cost: res.locals.totalCost,
            new_balance: results[0].points
        });
    };

    model.getUserBalance(data, callback);
};

// validate purchase input parameters
module.exports.validatePurchaseInput = (req, res, next) => {
    const { item_id, quantity } = req.body;

    if (!item_id) {
        return res.status(400).json({ message: "item_id is required" });
    }

    if (quantity && quantity < 1) {
        return res.status(400).json({ message: "quantity must be at least 1" });
    }

    next();
};
