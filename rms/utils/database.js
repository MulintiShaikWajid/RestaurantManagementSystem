const { Pool } = require('pg');
const { Client } = require('pg')
const pool = new Pool({
    user: 'wajid',     //your postgres username
    host: 'localhost', 
    database: 'test', //your local database 
    password: 'wajid', //your postgres user password
    port: 5432, //your postgres running port
});

pool.connect();

// const client = new Client({
//     user: 'wajid',     //your postgres username
//     host: 'localhost', 
//     database: 'test', //your local database 
//     password: 'wajid', //your postgres user password
//     port: 5432, //your postgres running port
//   });

// client.connect();

module.exports = pool;
