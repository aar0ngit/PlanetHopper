// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require("../services/db");

const database = pool.config.connectionConfig.database;

// set database to null to create it
pool.config.connectionConfig.database = null;

// sql statements
const CHECK_DB_SQL = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${database}'`;
const CREATE_DB_SQL = `CREATE DATABASE IF NOT EXISTS ${database}`;

// check if database exists
const callback = (error, results) => {
  if (error) {
    console.error('Error checking database:', error);
    process.exit(1);
    return;
  }

  if (results.length === 0) {
    // database does not exist, create it
    console.log(`Database "${database}" does not exist`);

    // create database
    const createCallback = (error, results) => {
      if (error) {
        console.error("Error creating database:", error);
      } else {
        console.log(`Database "${database}" has been created successfully`);
      }
      process.exit();
    };

    pool.query(CREATE_DB_SQL, createCallback);
  } else {
    // database already exists
    console.log(`Database "${database}" already exists`);
    process.exit();
  }
};

pool.query(CHECK_DB_SQL, callback);