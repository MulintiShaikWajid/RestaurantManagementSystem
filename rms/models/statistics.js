const pool = require('../utils/database');

module.exports = class statistics{
    static get_items_avgtime(){
        return pool.query('select item.name,avg(served_time-ordered_time) as average_time from my_order,item,order_item where my_order.id = order_item.order_id and order_item.item_id = item.id group by item.name');
    }

    static get_day_customer_num(){ 
        return pool.query('select TO_CHAR(served_time, $1) as day,count(*) from my_order group by TO_CHAR(served_time, $1)',['Dy']);        
    }

    static get_slot_customer_num(){
        return pool.query('select TO_CHAR(served_time, $1)  as day,count(*) from my_order group by TO_CHAR(served_time, $1) ',['Dy']);
    }

    static get_pop_dish(){
        return pool.query('select name from item,my_order,order_item where my_order.id = order_item.order_id and order_item.item_id = item.id group by name order by count(name) desc limit 5');
    }
}

