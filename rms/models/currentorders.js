const pool = require('../utils/database');

module.exports = class Currentorders{
    // constructor(){
    // }
        static orders(){
            return pool.query("select name,my_order.id,status from my_order,person where \
                (status='order-placed' or status='order-served') and my_order.customer_id=person.id;");
        }
        static tables(){
            return pool.query("with A as ((select my_table.id, my_table.status, person.username, person.name from my_table, table_request, \
                person where customer_id = person.id and table_id = my_table.id and to_timestamp($1) >= start_time and \
                to_timestamp($1) <= end_time and table_request.status = 'request-accepted' order by my_table.id) union (select M.id as id, \
                'available' as status, '' as username, '' as name from my_table M where not exists(select * from table_request \
                where table_id = M.id and to_timestamp($1) >= start_time and to_timestamp($1) <= end_time and \
                table_request.status = 'request-accepted') order by M.id)) select * from A order by id;", [Date.now()/1000]);
            // return pool.query("select * from my_table;");
        }
    }