const pool = require('../utils/database');

module.exports = class Notifications{
    // constructor(){
    // }
    static staff(){
        return pool.query("select person.id,username,salary,role_name,string_agg(slot,',') as time_slots\
        	 from staff,person,(select staff_id,concat(start_time,'-',end_time) as slot from \
        	staff_time_slot,time_slot where id=time_slot_id) as A\
        	where A.staff_id=staff.id and staff.id=person.id group by (person.id,salary,role_name);");
    }
    }