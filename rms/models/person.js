const pool = require('../utils/database');

module.exports = class Person{
    constructor(username,password){
        this.username = username;
        this.password = password;
    }
    get_details(){
        return pool.query('select * from person where username = $1 and password = $2',[this.username,this.password]);
    }
    update_session_id(session_id){
        return pool.query('update person set session_id = $1 where username = $2',[session_id,this.username]);
    }
    static get_details_from_session_id(session_id){
        return pool.query('select * from person where session_id = $1',[session_id]);
    }
    static check_customer(id){
        return pool.query('select * from customer where id=$1',[id]);
    }
    static logout(session_id){
        return pool.query('update person set session_id = $1 where session_id = $2',[null,session_id]);
    }
    static role(id){
        return pool.query('select role_name from staff where id=$1',[id]);
    }
}
