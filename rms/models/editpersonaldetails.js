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
    static edit_details(person_id, name, house_no, street, city, state, country, pin, password){
        return pool.query("update person set name = $1, address_house_no = $2, address_street = $3, address_city = \
        $4, address_state = $5, address_country = $6, address_pin_code = $7, password = $8 where id = $9", [name, house_no, street ,city, state, country, pin, password, person_id]);
    }
    static delete_phone_numbers(person_id){
        return pool.query("delete from phone where id = $1;", [person_id]);
    }
    static add_phone_numbers(person_id, ph_nos){
        var ph_string = "insert into phone values";
        for(var i = 0; i < ph_nos.length; i++){
            ph_string = ph_string+" ("+person_id+","+ph_nos[i]+"),";
        }
        if(ph_string[ph_string.length-1] == ","){
            ph_string = ph_string.substring(0, ph_string.length-1);
            ph_string = ph_string+";";
        }else{
            ph_string = "select * from staff limit 1";
        }

        return pool.query(ph_string);
    }
 
}