// P2509361
// Aaron Tan
// DIT/FT/1B/08

const model = require('../models/challengeModel');

module.exports.createChallenge = (req, res) => {
    const data = {
        user_id: req.body.user_id,
        description: req.body.description,
        points: req.body.points
    };

    // extract and validate input data
    if (!data.user_id || !data.description || !data.points || data.points <= 0) {
        return res.status(400).json({ message: "user_id, description, and positive points required" });
    }

    // return 201 with new challenge id or 500 if error
    const callback = (error, results) => {
        if (error) return res.status(500).send();
        res.status(201).json({
            challenge_id: results.insertId,
            user_id: data.user_id,
            description: data.description,
            points: data.points
        });
    };

    model.insertChallenge(data, callback);
};

module.exports.readAllChallenges = (req, res) => {
    const callback = (error, results) => {
        if (error) return res.status(500).send();
        res.status(200).json(results);
    };

    model.selectAllChallenges(callback);
};

module.exports.updateChallenge = (req, res) => {
    if (!req.body.user_id || !req.body.description || !req.body.points) {
        return res.status(400).send();
    }

    const data = {
        challenge_id: req.params.challenge_id,
        user_id: req.body.user_id,
        description: req.body.description,
        points: req.body.points
    };

    const callbackSelect = (error, results) => {
        if (error) return res.status(500).send();
        
        // verify challenge exists and user is the owner
        if (results.length === 0) return res.status(404).send();
        if (results[0].creator_id !== data.user_id) return res.status(403).send();

        // execute the update
        const callbackUpdate = (error) => {
            if (error) return res.status(500).send();
            res.status(200).json(data);
        };

        model.updateChallenge(data, callbackUpdate);
    };

    model.selectChallengeById({ challenge_id: data.challenge_id }, callbackSelect);
};

module.exports.deleteChallenge = (req, res) => {
    const data = { challenge_id: req.params.challenge_id };

    const callback = (error, results) => {
        if (error) return res.status(500).send();
        if (results.affectedRows === 0) {
            return res.status(404).send();
        }
        res.status(204).send();
    };

    model.deleteChallenge(data, callback);
};
