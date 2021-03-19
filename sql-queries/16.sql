-- view presently active orders

select name,order_id,status from my_order,person where status='order-placed' and my_order.customer_id=person.id;

--update order status

update order set status=<status> where order_id=<order_id>;

-- view table requests

select name,table_id,start_time,end_time from table_request,person where customer_id=id and status='request-placed';

-- update table requests

update table_request set status=<status> where request_id=<request_id>;

