const pool = require('../utils/database');
const crypto = require('crypto');
exports.check = function(username,password){
    //hash password before checking
    password = crypto.createHash('sha256').update(password+'squirrel').digest('hex');
    console.log(password);
    return pool.query('select username,password from person where username = $1 and password = $2',[username,password]);
}