---Place Order button : 
1)insert into my_order(customer_id,amount_paid,status) values (____from web-page____,0,"placing_order");
2)insert into order_item(item_id,quantity) values (select item_id,quantity from cart where cart.customer_id=____from web-page____);
---here order_id is generated in js file and inserted along with the above insert statements

---Remove button
delete from cart where customer_id=____from web-page____ and item_id=____from web-page_____;
