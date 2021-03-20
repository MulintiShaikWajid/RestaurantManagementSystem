---display of items in cart
select name,price from cart,item where cart.item_id=item.id and cart.customer_id=____from web-page____;

---All booked tables at current time by the respective user  
select table_id from table_request where customer_id=___from web-page____ and 
status='request-accepted' and start_time<___current-time___ and end_time>___current-time___;

---Place Order button 
---here order_id is generated in js file and inserted along with the above insert statements call it ORDER_ID
1)insert into my_order(id,customer_id,amount_paid,status) values (ORDER_ID,____from web-page____,0,"placing_order");
2)insert into order_item(order_id,item_id,quantity) values (select ORDER_ID as id,item_id,quantity 
from cart where cart.customer_id=____from web-page____);
3)insert into table_order(order_id,table_id) values (ORDER_ID,___input___);

---Remove button
delete from cart where customer_id=____from web-page____ and item_id=____from web-page_____;
