const { Pool } = require('pg');
const { Client } = require('pg')
const pool = new Pool({
    user: 'postgres',     //your postgres username
    host: 'localhost', 
    database: 'projectdb', //your local database 
    password: 'postgres', //your postgres user password
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

// module.exports = pool;