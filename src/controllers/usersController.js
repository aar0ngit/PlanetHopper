// P2509361
// Aaron Tan
// DIT/FT/1B/08

const model = require('../models/userModel');

module.exports.checkUsernameExists = (req, res, next) => {
    const data = { username: req.body.username };
    if (!data.username) return res.status(400).send();

    const callback = (error, results) => {
        if (error) return res.status(500).send();
        if (results.length > 0) return res.status(409).send();
        next();
    };

    model.checkUsername(data, callback);
};

module.exports.createNewUser = (req, res) => {
    const data = {
        username: req.body.username
    };

    if (!data.username) {
        return res.status(400).send();
    }

    const callback = (error, results) => {
        if (error) return res.status(500).send();
        res.status(201).json({
            user_id: results.insertId,
            username: data.username,
            points: 0
        });
    };

    model.insertUser(data, callback);
};

module.exports.readAllUsers = (req, res) => {
    const callback = (error, results) => {
        if (error) return res.status(500).send();
        res.status(200).json(results);
    };

    model.selectAllUsers(callback);
};

module.exports.readUserById = (req, res) => {
    const callback = (error, results) => {
        if (error) return res.status(500).send();
        if (results.length === 0) return res.status(404).send();
        res.status(200).json(results[0]);
    };

    model.selectUserById({ user_id: req.params.user_id }, callback);
};

module.exports.updateUser = (req, res) => {
    if (!req.body.username) return res.status(400).send();

    const data = {
        user_id: req.params.user_id,
        username: req.body.username,
        points: req.body.points
    };

    const callback = (error, results) => {
        if (error) return res.status(500).send();
        if (results.affectedRows === 0) return res.status(404).send();
        res.status(200).json({
            user_id: data.user_id,
            username: data.username,
            points: data.points
        });
    };

    model.updateUser(data, callback);
};
