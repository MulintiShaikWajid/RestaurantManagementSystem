const { Client} = require('pg');
const client = new Client({
    user: 'wajid',     //your postgres username
    host: 'localhost', 
    database: 'test', //your local database 
    password: 'wajid', //your postgres user password
    port: 5432, //your postgres running port
  });
client.connect();
module.exports=client;