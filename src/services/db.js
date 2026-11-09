// Planet Hopper: MySQL connection pool
// Aaron Tan

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  // hosted databases (e.g. TiDB Cloud) need TLS; local MySQL does not
  ssl: process.env.DB_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  multipleStatements: true,
  // keep the pool small: each serverless instance opens its own connections
  connectionLimit: process.env.VERCEL ? 2 : 10,
  dateStrings: true
});

module.exports = pool;
