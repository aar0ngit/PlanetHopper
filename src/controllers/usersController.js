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

module.exports.login = (req, res, next) => {

    const data = {
        username: req.body.username
    }
    
    const callback = (err, results) => {
        if (err) {
            console.error("Error getUserByUsername: ", err)
            res.status(500).json({ message: "DB Error" })
        }

        if (results.length == 0) {
            res.status(404).json({ message: "User not found" })
        }

        if (results && results.length > 0) {
            res.locals.hash = results[0].password
            next()
        }
    }
    userModel.getUserByUsername(data, callback);
}

module.exports.checkUsernameOrEmailExist = (req, res, next) => {

    const data = {
        username: req.body.username,
        email: req.body.email
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error checkEmailUsername: ", error);
            res.status(500).json({ message: 'DB Error' });
        }
        if (results.length > 0) {
            res.status(409).json({ message: "Username or email already exists" })
        }

        else {
            res.locals.username = data.username;
            res.locals.email = data.email;
            next();
        }
    }

    userModel.checkEmailUsername(data, callback);
}

module.exports.register = (req, res, next) => {

    const data = {
        hashedPassword: res.locals.hash,
        username: res.locals.username,
        email: res.locals.email
    }

    const callback = (err, results) => {
        if (err) {
            console.error("Error insertHash: ", err);
            res.status(500).json({ message: "DB Error" })
        }
        if (results.affectedRows == 0) {
            res.status(401).json({ message: "Hash not inserted into DB"})
        }

        else {
            res.status(200).json({ message: `User ${res.locals.username} created successfully.` });
        }
    }
    userModel.insertHash(data, callback);
}
