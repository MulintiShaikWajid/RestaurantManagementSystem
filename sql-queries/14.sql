--Graph of items vs number of orders in selected time period
  select item.name,count(*) from item,my_order,order_item where my_order.id = order_item.order_id and item.id = order_item.item_id and my_order.ordered_time < given_value1 and my_order.ordered_time > given_value2 group by item.name;
  
 --Graph of items vs average time to prepare
  select item.name,avg(served_time-ordered_time) as average_time from my_order,item,order_item where my_order.id = order_item.order_id and order_item.item_id = item.id group by item.name;
 
 --day of week vs number of customer
  select DAYNAME(served_time) as day,count(*) from my_orders group by DAYNAME(served_time);
  
 --time slot of the day vs number of customers
  //select DAYNAME(served_time) as day,count(*) from my_orders group by DAYNAME(served_time);

-- popular disher
  select name from item,order,order_item where order.id = order_item.order_id and order_id.item_id = item.id and item.id = item_item_tag.item_id group by name order by count(name) desc limit 5;
