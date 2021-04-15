const pool= require('../utils/database');
module.exports = class Login{

    constructor(username,hash_pass){
        this.username=username;
        this.pass=hash_pass;
    }

    check_login(){
    	return pool.query('select id from person where username=$1 and password=$2;',[this.username,this.pass]);
    }

};