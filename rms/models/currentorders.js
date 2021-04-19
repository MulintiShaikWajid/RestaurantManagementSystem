const pool = require('../utils/database');

module.exports = class Currentorders{
    // constructor(){
    // }
    static orders(){
        return pool.query("select name,my_order.id,status from my_order,person where \
        	(status='order-placed' or status='order-served') and my_order.customer_id=person.id;");
    }
    static tables(){
    	return pool.query("select * from my_table;");
    }
    }