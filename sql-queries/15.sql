---Edit personal details
  update person set password = "",name="" ... where username = given_user_name;

---list 
  select username,price*quantity - rcoins_used from order_item,my_order,person,item where my_order.amount_paid is null and order_itme.order_id = given_id and item.id = order_item.item_id and person.id = my_order.customer_id ;
---paid using cash
  update my_order set amount_paid = (select sum(price*quantity) from order_item,item where  order_item.order_id = given_id and item.id = order_item.item_id) where id = given_id;

---updating rcoins
  update customer set rcoins =rcoins + 1 where id = given_cus_id;
