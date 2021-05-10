const pool = require('../utils/database');

module.exports = class Headwaiterhello{
    // constructor(){
    // }
    static get_current_orders(){
        return pool.query("select P.username, P.name, M.id, M.status \
        from person P, my_order M where M.customer_id = P.id and M.status != 'order-completed' \
        group by (M.id, P.id) order by P.name;"
         , [new Date().toISOString().slice(0, 10), new Date().getHours()]);
    }
    static get_offline_orders(){
        return pool.query("select id, rcoins_used, status from my_order where status != 'order-completed' and customer_id is NULL order by id;");
    }
    static get_table_requests(){
    	return pool.query("select username, name, table_id, requested_time, booked_day, time_slot, request_id from table_request B, person \
        where customer_id=id and status='request-placed' and not exists(select A.request_id from table_request A \
        where A.request_id != B.request_id and A.booked_day = B.booked_day and A.time_slot = B.time_slot and \
        A.status = 'request-accepted') order by requested_time;");
    }
    static get_live_table_status(){
        return pool.query("with A as ((select my_table.id, my_table.capacity, my_table.location, my_table.status, person.username, person.name, table_request.request_id \
        from my_table, table_request, person where customer_id = person.id and table_id = my_table.id and $1 = booked_day and \
        $2 = time_slot and table_request.status = 'request-accepted' order by my_table.id) union (select M.id as id, M.capacity, \
        M.location, M.status, '' as username, '' as name, -1 as request_id from my_table M where not exists(select * from table_request \
        where table_id = M.id and $1 = booked_day and $2 = time_slot and \
        table_request.status = 'request-accepted') order by M.id)) select * from A order by id;", [new Date().toISOString().slice(0, 10), new Date().getHours()]);
        
    }
    static next_order_status(order_id){
        return pool.query("update my_order set status = 'order-served', served_time = to_timestamp($2) where id = $1;", [order_id,Date.now()/1000]);
    }
    static accept_table_request(request_id){
        return pool.query("update table_request set status = 'request-accepted' where request_id = $1;", [request_id]);
    }
    static reject_table_request(request_id){
        return pool.query("update table_request set status = 'request-denied' where request_id = $1;", [request_id]);
    }
    static denytherequest(request_id){
        return pool.query("update table_request set status = 'request-denied' where request_id = $1;", [request_id]);
    }
    static changetooccupied(table_id){
        return pool.query("update my_table set status = 'occupied' where id = $1;",[table_id]);
    }
    static changetoavailable(table_id){
        return pool.query("update my_table set status = 'available' where id = $1;",[table_id]);
    }
    static handleuselessrequests(table_id){
        return pool.query("update table_request set status = 'request-denied' where table_id = $3 and $1 = booked_day and \
        $2 = time_slot;",[new Date().toISOString().slice(0, 10), new Date().getHours(), table_id])
    }
    static checkcurrenttablestatus(request_id){
        return pool.query("select count(*) as count from table_request T, my_table M where M.id = T.table_id and M.status = 'occupied' and $2 = booked_day and \
        $3 = time_slot and T.request_id = $1;", [request_id, new Date().toISOString().slice(0, 10), new Date().getHours()]);
    }
    static openofflineorder(){
        return pool.query("select I.id, I.name, I.price, string_agg(IT.type,',') as tags from item I, item_tag IT, \
         item_item_tag IIT where I.id = IIT.item_id and IT.id = IIT.tag_id group by (I.id, I.name, I.price) order by I.name");
    }
    static checktable(id){
        return pool.query("select status from my_table where id=$1",[id]);
    }
    static gettabledetails(){
        return pool.query("select * from my_table order by id;");
    }
    static getallitemdetails(){
        return pool.query("select I.item_id, I.inventory_id, I.quantity_needed, item.price from item, item_inventory I \
        where I.item_id = item.id order by item_id, inventory_id;");
    }
    static getallingredientdetails(){
        return pool.query("select * from inventory order by id;");
    }
    static getneworderid(){
        return pool.query("select max(id)+1 as newid from my_order;");
    }
    static insertorder(id, tableid){
        return pool.query("insert into my_order values($1, NULL, to_timestamp($2), NULL, NULL, 0, $3, 'order-placed');",[id,Date.now()/1000,tableid]);
    }
    static insertorderitem(id, items, price){
        var tag_string = "insert into order_item values";
        for(var key in items){
            tag_string = tag_string+" ("+(id).toString()+","+(key).toString()+","+(items[key]).toString()+","+(price[key]).toString()+"),";
        }
        if(tag_string[tag_string.length-1] == ","){
            tag_string = tag_string.substring(0, tag_string.length-1);
            tag_string = tag_string+";";
        }else{
            tag_string = "select * from staff limit 1";
        }
        return pool.query(tag_string);
    }
    static removeingredients(inventory){
        var tag_string = "update inventory set quantity_remaining = case "
        var entered = false;
        for(var key in inventory){
            entered = true;
            //console.log((inventory[key]).toString());
            tag_string = tag_string+" when id = "+(key).toString()+ " then quantity_remaining - "+(inventory[key]).toString();
        }
        if(entered){
            tag_string = tag_string+" else quantity_remaining end;";
        }else{
            tag_string = "select * from staff limit 1";
        }

        return pool.query(tag_string);
    }
    static logout(userid){
        return pool.query("update person set session_id=NULL where id=$1",[userid]);
    }
}