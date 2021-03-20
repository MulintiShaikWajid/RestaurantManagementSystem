---Edit personal details
  update person set password = "",name="" ... where username = given_user_name;

---list 

---paid using Rcoins
  update customer set rcoins = rcoins - (select sum(price*quantity) from order_item,item where  order_item.order_id = given_id and item.id = order_item.item_id) where id = given_cus_id;
  update my_order set rcoins_used = (select sum(price*quantity) from order_item,item where  order_item.order_id = given_id and item.id = order_item.item_id) where id = given_id;
---paid using cash
  update my_order set amount_paid = (select sum(price*quantity) from order_item,item where  order_item.order_id = given_id and item.id = order_item.item_id) where id = given_id;
