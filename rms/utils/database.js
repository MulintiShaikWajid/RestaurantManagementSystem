const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',     //your postgres username
    host: 'localhost', 
    database: 'projectdb', //your local database 
    password: 'Phani@2000', //your postgres user password
    port: 5432, //your postgres running port
});

pool.connect();


module.exports = pool;