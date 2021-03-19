---Menu button :
select * from (select item.id,name,price,type,rating from item_tag,item_item_tag,item where 
              item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id) as B,
              left outer join (select 1.0*sum(stars)/count(order_id),item_id as rating from rating group by item_id) 
              as A on A.item_id=B.id; 

---Cart button : 
select name,price from cart,item where cart.item_id=item.id and customer_id=____from web-page____;

---Previous orders button : 
select * from my_order where my_order.customer_id=____from web-page____;

---Book a table button : 
select * from my_table;

---Previous table requests button : 
select table_id,(times),status from my_table,my_order where my_order.id=my_table.table_id;
