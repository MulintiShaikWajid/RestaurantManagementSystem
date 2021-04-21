const pool = require('../utils/database');

module.exports = class Editpersonaldetails{
    // constructor(){
    // }
    static get_personal_details(person_id){
        return pool.query("select * from person where id = $1;", [person_id]);
    }
    static get_phone_numbers(person_id){
        return pool.query("select * from phone where id = $1", [person_id]);
    }
    
}