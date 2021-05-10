const pool = require('../utils/database');

module.exports = class Currentorders{
    // constructor(){
    // }
        static orders(){
            return pool.query("select P.username, P.name, M.id, M.status, sum(O.total_price) - M.rcoins_used as pending_payment \
            from person P, my_order M, order_item O where M.customer_id = P.id and M.id = O.order_id and M.status != 'order-completed' \
            group by (M.id, P.id) having sum(O.total_price) - M.rcoins_used > 0 order by P.name;");
        }
        static offlineorders(){
            return pool.query("select M.rcoins_used, M.id, M.status, sum(O.total_price) as pending_payment \
             from my_order M, order_item O where M.customer_id is NULL and M.id = O.order_id and M.status != 'order-completed' \
             group by (M.id, M.rcoins_used) order by M.id;");
        }
        static tables(){
        //     return pool.query("with A as ((select my_table.id, 'occupied' as status, person.username, person.name from my_table, table_request, \
        // person where customer_id = person.id and table_id = my_table.id and $1 = booked_day and \
        // $2 = time_slot and table_request.status = 'request-accepted' order by my_table.id) union (select M.id as id, \
        // 'available' as status, '' as username, '' as name from my_table M where not exists(select * from table_request \
        // where table_id = M.id and $1 = booked_day and $2 = time_slot and \
        // table_request.status = 'request-accepted') order by M.id)) select * from A order by id;", [new Date().toISOString().slice(0, 10), new Date().getHours()]);
            return pool.query("select * from my_table order by id;");
        }
    }