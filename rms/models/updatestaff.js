const pool = require('../utils/database');

module.exports = class Updatestaff{
    // constructor(){
    // }
        static staff(){
            return pool.query("select person.id,username,name,dob,salary,role_name,string_agg(cast(slot as text),',' order by slot) as time_slots\
                from staff,person,(select staff_id,time_slot_id as slot from staff_time_slot) as A \
                where A.staff_id=staff.id and staff.id=person.id group by (person.id,salary,role_name,dob);");
        }
        static checknewstaff(username){
            return pool.query("select count(*) as item_count from person where username = $1", [username]);
        }
        static get_newid(){
            return pool.query("select max(id) as new_id from person;");
        }
        static new_person(username, name, password){
            return pool.query("insert into person(id, username, name, password) values(default,$1,$2,$3);", [username, name, password]);
        }
        static new_staff(id, salary, dob, role){
            return pool.query("insert into staff values($1, $2, $3, $4);",[id, salary, dob, role]);
        }
        static bulk_timeslots(id, body){
            var tag_string = "insert into staff_time_slot values";
            for(var key in body){
                if(key.length<4){
                    continue;
                }
                if(key.substr(0,4)=="tag_"){
                    tag_string = tag_string+" ("+id+","+body[key]+"),";
                }
            }
            if(tag_string[tag_string.length-1] == ","){
                tag_string = tag_string.substring(0, tag_string.length-1);
                tag_string = tag_string+";";
            }else{
                tag_string = "select * from staff limit 1";
            }
            return pool.query(tag_string);
        }
        static getstaffdetails(id){
            return pool.query("select person.id, person.username, person.password, person.name, staff.salary, to_char(staff.dob, 'YYYY-MM-DD') as dob, staff.role_name \
             from person, staff where person.id = staff.id and person.id = $1;",[id]);
        }
        static gettimeslotdetails(id){
            return pool.query("select * from staff_time_slot where staff_id = $1;", [id]);
        }
        static delete_staff(id){
            return pool.query("delete from person where id = $1;",[id]);
        }
        static partialupdate(id, salary, dob, role){
            return pool.query("update staff set salary = $2, dob = $3, role_name = $4 where id = $1;",[id, salary, dob, role]);
        }
        static delete_timeslots(id){
            return pool.query("delete from staff_time_slot where staff_id = $1;",[id]);
        }
    }