const pool = require('../utils/database');

module.exports = class Cashierhello{
    // constructor(){
    // }
    static pending_payments(){
        return pool.query("select P.username, P.name, M.id, sum(O.total_price) - M.rcoins_used as pending_payment \
         from person P, my_order M, order_item O where M.customer_id = P.id and M.id = O.order_id\
         group by (M.id, P.id) having sum(O.total_price) - M.rcoins_used > 0;");
    }
    static complete_payment(order_id, amount_paid){
    	return pool.query("update my_order set amount_paid = $1 where id = $2", [amount_paid, order_id]);
    }
    static add_rcoins(username, amount_paid){
    	return pool.query("update customer set rcoins = rcoins + $1 from person where person.id = customer.id \
         and person.username = $2;", [0.01*amount_paid, username]);
    }
    static add_complete_time(order_id){
    	return pool.query("update my_order set completed_time = to_timestamp($1) where id = $2", [Date.now()/1000, order_id]);
    }
    static update_order_status(order_id){
        return pool.query("update my_order set status = 'order-completed' where id = $1", [order_id]);
    }
}