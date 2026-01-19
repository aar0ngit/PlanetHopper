// P2509361
// Aaron Tan
// DIT/FT/1B/08

const model = require("../models/inventoryModel");

// adds a new cosmic item to a user's inventory
module.exports.addItem = (req, res) => {
    if (!req.body.user_id || !req.body.item_name) return res.status(400).send();

    const callback = (err, results) => {
        if (err) return res.status(500).send();
        res.status(201).json({ item_id: results.insertId, ...req.body });
    };

    model.insertItem(req.body, callback);
};

// retrieves all items for a specific user or returns 404 if none found
module.exports.readInventory = (req, res) => {
    const data = { user_id: req.params.user_id };

    const callback = (err, results) => {
        if (err) return res.status(500).send();
        if (results.length === 0) {
            return res.status(404).json({ message: "Inventory is empty" });
        }
        res.status(200).json(results);
    };

    model.selectInventoryByUser(data, callback);
};
