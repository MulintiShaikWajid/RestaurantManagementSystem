const pool = require('../utils/database');

module.exports = class Headwaiterhello{
    // constructor(){
    // }
    static get_current_orders(){
        return pool.query("select username, name, my_order.id, status from my_order,person where status != 'order-completed' and my_order.customer_id=person.id;");
    }
    static get_table_requests(){
    	return pool.query("select username, name, table_id, requested_time, booked_day, time_slot, request_id from table_request B, person \
        where customer_id=id and status='request-placed' and not exists(select A.request_id from table_request A \
        where A.request_id != B.request_id and A.booked_day = B.booked_day and A.time_slot = B.time_slot and \
        A.status = 'request-accepted') order by requested_time;");
    }
    static get_live_table_status(){
        return pool.query("with A as ((select my_table.id, 'occupied' as status, person.username, person.name from my_table, table_request, \
        person where customer_id = person.id and table_id = my_table.id and $1 = booked_day and \
        $2 = time_slot and table_request.status = 'request-accepted' order by my_table.id) union (select M.id as id, \
        'available' as status, '' as username, '' as name from my_table M where not exists(select * from table_request \
        where table_id = M.id and $1 = booked_day and $2 = time_slot and \
        table_request.status = 'request-accepted') order by M.id)) select * from A order by id;", [new Date().toISOString().slice(0, 10), new Date().getHours()]);
    }
    static next_order_status(order_id){
        return pool.query("update my_order set status = 'order-served' where id = $1", [order_id]);
    }
    static accept_table_request(request_id){
        return pool.query("update table_request set status = 'request-accepted' where request_id = $1", [request_id]);
    }
    static reject_table_request(request_id){
        return pool.query("update table_request set status = 'request-denied' where request_id = $1", [request_id]);
    }
    static logout(userid){
        return pool.query("update person set session_id=NULL where id=$1",[userid]);
    }
}