const pool = require('../utils/database');

module.exports = class Headwaiterhello{
    // constructor(){
    // }
    static get_current_orders(){
        return pool.query("select username, name, my_order.id, status from my_order,person where status != 'order-completed' and my_order.customer_id=person.id;");
    }
    static get_table_requests(){
    	return pool.query("select username, name, table_id, start_time, end_time, request_id from table_request, person where customer_id=id and status='request-placed';");
    }
    static get_live_table_status(){
        return pool.query("with A as ((select my_table.id, my_table.status, person.username, person.name from my_table, table_request, \
        person where customer_id = person.id and table_id = my_table.id and to_timestamp($1) >= start_time and \
        to_timestamp($1) <= end_time and table_request.status = 'request-accepted' order by my_table.id) union (select M.id as id, \
        M.status as status, '' as username, '' as name from my_table M where not exists(select * from table_request \
        where table_id = M.id and to_timestamp($1) >= start_time and to_timestamp($1) <= end_time and \
        table_request.status = 'request-accepted') order by M.id)) select * from A order by id;", [Date.now()/1000]);
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
}