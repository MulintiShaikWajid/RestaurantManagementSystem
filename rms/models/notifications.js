const pool = require('../utils/database');

module.exports = class Notifications{
    // constructor(){
    // }
    static notify(id){
        return pool.query("select * from notification where person_id=$1 order by time_stamp;",[id]);
    }
    static check_customer(id){
        return pool.query("select count(*) as count from customer where id = $1;",[id]);
    }
}