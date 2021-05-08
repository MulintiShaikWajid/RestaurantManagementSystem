const { use } = require('../routes/customer');
const pool = require('../utils/database');
module.exports = class Item{
    static get_cart(userid){
        return pool.query('select item.id,item.name,item.price,cart.quantity from item,cart where item.id=cart.item_id and cart.customer_id=$1',[userid]);
    }
    static is_cart_empty(userid){
        return pool.query('select * from cart where customer_id=$1 and quantity>0',[userid]);
    }
    static check_table_availability(userid,tableno,time_slot,date){
        console.log(userid,tableno,time_slot,date);
        return pool.query("select * from table_request where customer_id=$1 and table_id=$2 and time_slot=$3 and booked_day=$4 and status='request-accepted'",[userid,tableno,time_slot,date]);
    }
    static get_max_order_id(){
        return pool.query('select max(id) as maxi from my_order');
    }
    static place_order(userid,tableno,maxi){
        return pool.query("with temp1 as (insert into my_order values ($3,$1,DEFAULT,NULL,NULL,NULL,NULL,'order-placed')), \
        temp3 as (delete from cart where customer_id=$1),\
        temp2 as (insert into order_item(order_id,item_id,quantity,total_price) (select $3 as id,item_id,quantity,quantity*price as total_price from cart,item where item.id=cart.item_id and cart.customer_id=$1))  \
        insert into table_order(order_id,table_id) values ($3,$2);",[userid,tableno,maxi]);
    }
    static get_previous_orders(userid){
        return pool.query("select my_order.id,my_order.ordered_time,STRING_AGG(item.name,',') as items from my_order,order_item,item where my_order.customer_id=$1 and item.id=order_item.item_id and order_item.order_id=my_order.id group by my_order.id;",[userid]);
    }
    static is_order_valid(userid,orderid){
        return pool.query("select * from my_order where customer_id=$1 and id=$2",[userid,orderid]);
    }
    static get_order_details(orderid){
        return pool.query("select status,name,quantity,itemid,price,coalesce(stars,0) as mystars,coalesce(review,'Not reviewed') as myreview from (select status,item.name,quantity,item.id as itemid,coalesce(total_price,0) as price from my_order,order_item,item where my_order.id=$1 and order_item.order_id=$1 and order_item.item_id=item.id) as temp left outer join rating on rating.item_id=itemid and rating.order_id=$1",[orderid]);
    }
    static check_valid_order_id_item_id(itemid,orderid,userid){
        return pool.query("select * from order_item,my_order where my_order.id=order_item.order_id and order_item.item_id=$1 and my_order.id=$2 and my_order.customer_id=$3",[itemid,orderid,userid]);
    }
    static rate(itemid,orderid,rating){
        return pool.query('insert into rating values($2,$1,$3,NULL) on conflict (order_id,item_id) do update set stars=$3 where rating.order_id=$2 and rating.item_id=$1',[itemid,orderid,rating]);
    }
    static review(itemid,orderid,review){
        return pool.query('insert into rating values($2,$1,NULL,$3) on conflict (order_id,item_id) do update set review=$3 where rating.order_id=$2 and rating.item_id=$1',[itemid,orderid,review]);
    }
    static get_notifications(userid){
        return pool.query("select info,time_stamp from notification where person_id=$1",[userid]);
    }
    static insert_table_request(userid,tabelno,date,hour){
        return pool.query("insert into table_request values(2003,$2,$1,DEFAULT,$3,$4,'request-placed')",[userid,tabelno,date,hour]);
    }
    static get_total_tables(){
        return pool.query("select * from my_table");
    }
    static get_prevtable(userid){
        return pool.query("select * from table_request where customer_id=$1",[userid]);
    }
    static already_booked(userid,tabelno,date,hour){
        return pool.query("select * from table_request where customer_id<>$1 and booked_day=$3 and time_slot=$4 and table_id=$2 and status='request-accepted'",[userid,tabelno,date,hour]);
    }
    static logout(userid){
        return pool.query("update person set session_id=NULL where id=$1",[userid]);
    }
    static check_username(temp){
        return pool.query("select * from person where username=$1",[temp]);
    }
    static create(username,password,myname,hno,street,city,state,country,pin){
        return pool.query("insert into person values(DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8,$9,NULL)",[username,password,myname,hno,street,city,state,country,pin])
    }
    static get_id(username){
        return pool.query("select id from person where username=$1",[username]);
    }
    static insert_phone(id,phone){
        return pool.query("with temp1 as (insert into phone values($1,$2)) insert into customer values($1,0)",[id,phone]);
    }
    static check_phone(phone){
        return pool.query("select * from phone where phone_number=$1",[phone]);
    }
}

