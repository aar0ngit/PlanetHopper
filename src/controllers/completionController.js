// P2509361
// Aaron Tan
// DIT/FT/1B/08

const model = require('../models/completionModel');

module.exports.validateIds = (req, res, next) => {
    if (!req.body.user_id || !req.params.challenge_id) {
        return res.status(400).json({ message: "user_id and challenge_id required" });
    }
    next();
};

module.exports.validateUser = (req, res, next) => {
    const callback = (err, results) => {
        if (err) return res.status(500).send();
        if (results.length === 0) return res.status(404).json({ message: "User not found" });
        next();
    };

    model.checkUser({ user_id: req.body.user_id }, callback);
};

module.exports.validateChallenge = (req, res, next) => {
    const callback = (err, results) => {
        if (err) return res.status(500).send();
        if (results.length === 0) return res.status(404).json({ message: "Challenge not found" });
        next();
    };

    model.checkChallenge({ challenge_id: req.params.challenge_id }, callback);
};

module.exports.completeChallenge = (req, res) => {
    if (!req.body.user_id || !req.body.transmission_notes) return res.status(400).send();

    const data = {
        user_id: req.body.user_id,
        challenge_id: req.params.challenge_id,
        completed_at: req.body.completed_at || new Date().toISOString().slice(0, 10),
        details: req.body.transmission_notes
    };

    const callbackCompletion = (err, results) => {
        if (err) return res.status(500).send();

        const callbackPoints = (err) => {
            if (err) return res.status(500).send();
            res.status(201).json({
                completion_id: results.insertId,
                user_id: data.user_id,
                challenge_id: data.challenge_id,
                transmission_notes: data.details
            });
        };

        model.updateUserPoints(data, callbackPoints);
    };

    model.insertCompletion(data, callbackCompletion);
};

module.exports.readCompletionsByChallenge = (req, res) => {
    const data = { challenge_id: req.params.challenge_id };

    const callback = (error, results) => {
        if (error) return res.status(500).send();
        if (results.length === 0) {
            return res.status(404).send();
        }
        res.status(200).json(results);
    };

    model.selectCompletionsByChallenge(data, callback);
};
