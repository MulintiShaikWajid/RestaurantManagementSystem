const pool = require('../utils/database');

module.exports = class statistics{
    // constructor(username,password){
    //     this.username = username;
    //     this.password = password;
    // }
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


// // --Graph of items vs average time to prepare
// //   select item.name,avg(served_time-ordered_time) as average_time from my_order,item,order_item where my_order.id = order_item.order_id and order_item.item_id = item.id group by item.name;
 
// //  --day of week vs number of customer
// //   select DAYNAME(served_time) as day,count(*) from my_order group by DAYNAME(served_time);
  
// //  --time slot of the day vs number of customers
// //   //select DAYNAME(served_time) as day,count(*) from my_order group by DAYNAME(served_time);

// // -- popular disher
// //   select name from item,order,order_item where order.id = order_item.order_id and order_id.item_id = item.id and item.id = item_item_tag.item_id group by name order by count(name) desc limit 5;

}

