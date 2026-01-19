// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require("../services/db");

const database = pool.config.connectionConfig.database;

pool.config.connectionConfig.database = null;

const CHECK_DB_SQL = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${database}'`;
const CREATE_DB_SQL = `CREATE DATABASE IF NOT EXISTS ${database}`;

pool.query(CHECK_DB_SQL, (error, results) => {
  if (error) {
    console.error('Error checking database:', error);
    return;
  }
  
  if (results.length === 0) {
    pool.query(CREATE_DB_SQL, (error, results) => {
      if (error) {
        console.error("Error creating database:", error);
      } else {
        console.log(`Database "${database}" has been created successfully`);
      }
      process.exit();
    });
  }
  else {
    console.log(`Database "${database}" already exists`);
    process.exit();
  }
});