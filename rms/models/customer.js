const { use } = require('../routes/customer');
const pool = require('../utils/database');
const client = require('../utils/mydatabase');
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
        // return pool.query("with temp1 as (insert into my_order values (DEFAULT,$1,DEFAULT,NULL,NULL,NULL,0,'order-placed')), \
        // temp4 as (update inventory set quantity_remaining=quantity_remaining-quantity*quantity_needed from item_inventory,cart where cart.customer_id=$1 and cart.item_id=item_inventory.item_id and inventory.id=item_inventory.inventory_id),    \
        // temp2 as (insert into order_item(order_id,item_id,quantity,total_price) (select (select max(id) from my_order) as id,item_id,quantity,quantity*price as total_price from cart,item where item.id=cart.item_id and cart.customer_id=$1)),  \
        // temp3 as (delete from cart where customer_id=$1),\
        // temp6 as (update my_order set amount_paid=(select sum(total_price) from order_item where order_id=(select max(id) from my_order)) where my_order.id=(select max(id) from my_order)) \
        // insert into table_order(order_id,table_id) values ((select max(id) from my_order),$2);",[userid,tableno]);
        return client.query('BEGIN').then(()=>client.query("insert into my_order values (DEFAULT,$1,DEFAULT,NULL,NULL,NULL,0,'order-placed')",[userid])).then(()=>client.query("update inventory set quantity_remaining=quantity_remaining-quantity*quantity_needed from item_inventory,cart where cart.customer_id=$1 and cart.item_id=item_inventory.item_id and inventory.id=item_inventory.inventory_id",[userid])).then(()=>client.query("insert into order_item(order_id,item_id,quantity,total_price) (select (select max(id) from my_order) as id,item_id,quantity,quantity*price as total_price from cart,item where item.id=cart.item_id and cart.customer_id=$1)",[userid])).then(()=>client.query("delete from cart where customer_id=$1",[userid])).then(()=>client.query("update my_order set amount_paid=(select sum(total_price) from order_item where order_id=(select max(id) from my_order)) where my_order.id=(select max(id) from my_order)",[])).then(()=>client.query("insert into table_order(order_id,table_id) values ((select max(id) from my_order),$1)",[tableno])).then(()=>client.query("COMMIT")).catch((err)=>{client.query("ROLLBACK");throw err});
    }
    static get_previous_orders(userid){
        return pool.query("select my_order.id,my_order.ordered_time,my_order.status,my_order.rcoins_used,STRING_AGG(item.name,',') as items from my_order,order_item,item where my_order.customer_id=$1 and item.id=order_item.item_id and order_item.order_id=my_order.id group by my_order.id;",[userid]);
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
        return pool.query("insert into table_request values(DEFAULT,$2,$1,DEFAULT,$3,$4,'request-placed')",[userid,tabelno,date,hour]);
    }
    static get_total_tables(){
        return pool.query("select * from my_table");
    }
    static get_prevtable(userid){
        return pool.query("select * from table_request where customer_id=$1",[userid]);
    }
    static already_booked(userid,tabelno,date,hour,y,m,d,py,pm,pd,ph){
        // y=undefined
        // m=undefined
        // d=undefined
        // [y,m,d] = date.split('-')
        // py=new Date().getYear()+1900;
        // pm=new Date().getMonth()+1;
        // pd=new Date().getDate();
        // ph=new Date().getHours();
        if(py===y && pm===m && pd==d && hour===ph){
            console.log("CUSTOMER1");
            return pool.query("(select 1 from table_request where customer_id<>$1 and booked_day=$3 and time_slot=$4 and table_id=$2 and status='request-accepted') union all (select 1 from my_table where id=$2 and status='occupied')",[userid,tabelno,date,hour]);
        }
        return pool.query("select 1 from table_request where customer_id<>$1 and booked_day=$3 and time_slot=$4 and table_id=$2 and status='request-accepted'",[userid,tabelno,date,hour]);
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
        // return pool.query("with temp1 as (insert into phone values($1,$2)) insert into customer values($1,0)",[id,phone]);
        return client.query("BEGIN").then(()=>client.query("insert into phone values($1,$2)",[id,phone])).then(()=>{client.query("insert into customer values($1,0)",[id])}).then(()=>client.query("COMMIT")).catch((err)=>{client.query("ROLLBACK");throw err});
    }
    static check_phone(phone){
        return pool.query("select * from phone where phone_number=$1",[phone]);
    }
    static personal_details(id){
        return pool.query("select * from person where id=$1",[id]);
    }
    static phone_numbers(id){
        return pool.query("select * from phone where id=$1",[id]);
    }
    static update_name(id,name){
        return pool.query("update person set name=$2 where id=$1",[id,name]);
    }
    static update_username(id,name){
        return pool.query("update person set username=$2 where id=$1",[id,name]);
    }
    static update_hno(id,name){
        return pool.query("update person set address_house_no=$2 where id=$1",[id,name]);
    }
    static update_street(id,name){
        return pool.query("update person set address_street=$2 where id=$1",[id,name]);
    }
    static update_city(id,name){
        return pool.query("update person set address_city=$2 where id=$1",[id,name]);
    }
    static update_state(id,name){
        return pool.query("update person set address_state=$2 where id=$1",[id,name]);
    }
    static update_country(id,name){
        return pool.query("update person set address_country=$2 where id=$1",[id,name]);
    }
    static update_pin(id,name){
        return pool.query("update person set address_pin_code=$2 where id=$1",[id,name]);
    }
    static update_phone(id,name){
        console.log(name);
        return pool.query("delete from phone where id=$1 and phone_number=$2",[id,name]);
    }
    static update_password(id,name){
        return pool.query("update person set password=$2 where id=$1",[id,name]);
    }
    static add_phone(id,name){
        return pool.query("insert into phone values ($1,$2)",[id,name]);
    }
    static get_rcoins_used(id,order_id){
        return pool.query("select rcoins_used from my_order where customer_id=$1 and id=$2",[id,order_id]);
    }
    static update_amount_paid(id,order_id,rcoins){
        // return pool.query("with temp1 as (update my_order set amount_paid=amount_paid-$3,rcoins_used=rcoins_used+$3 where customer_id=$1 and order_id=$2) update customer set rcoins=rcoins-$3",[id,order_id,rcoins]);
        return client.query("BEGIN").then(()=>client.query("update my_order set amount_paid=amount_paid-$3,rcoins_used=rcoins_used+$3 where customer_id=$1 and id=$2",[id,order_id,rcoins])).then(()=>{client.query("update customer set rcoins=rcoins-$1",[rcoins])}).then(()=>client.query("COMMIT")).catch((err)=>{client.query("ROLLBACK");throw err});
    }
    static get_table_details(){
        return pool.query("select * from my_table");
    }
}  

