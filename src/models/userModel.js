// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require('../services/db');

// adds a new user to the system
module.exports.insertUser = (data, callback) => {
    const SQL = `INSERT INTO User (username) VALUES (?);`;
    const VALUES = [data.username];
    pool.query(SQL, VALUES, callback);
};

// fetches all users from the database
module.exports.selectAllUsers = (callback) => {
    const SQL = `SELECT * FROM User;`;
    pool.query(SQL, callback);
};

// checks if a specific username already exists
module.exports.checkUsername = (data, callback) => {
    const SQL = `SELECT * FROM User WHERE username = ?;`;
    const VALUES = [data.username];
    pool.query(SQL, VALUES, callback);
};

// retrieves a single user's profile by their unique id
module.exports.selectUserById = (data, callback) => {
    const SQL = `SELECT * FROM User WHERE user_id = ?;`;
    pool.query(SQL, [data.user_id], callback);
};

// updates username and points for an existing user
module.exports.updateUser = (data, callback) => {
    const SQL = `UPDATE User SET username = ?, points = ? WHERE user_id = ?;`;
    pool.query(SQL, [data.username, data.points, data.user_id], callback);
};

module.exports.checkEmailUsername = (data, callback) => {

    const MYSQLSTATEMENT = `
    SELECT * FROM User
    WHERE username = ? AND email = ?
    `;

    const VALUES = [data.username, data.email];

    pool.query(MYSQLSTATEMENT, VALUES, callback);
}

module.exports.getUserByUsername = (data, callback) => {

    const MYSQLSTATEMENT = `
    SELECT * FROM User
    WHERE username = ?
    `;

    const VALUES = [data.username]

    pool.query(MYSQLSTATEMENT, VALUES, callback);
}

module.exports.insertHash = (data, callback) => {
    
    const MYSQLSTATEMENT = `
    INSERT INTO User (password, email, username)
    VALUES (?, ?, ?)
    `;

    const VALUES = [data.hashedPassword, data.email, data.username];

    pool.query(MYSQLSTATEMENT, VALUES, callback);
}