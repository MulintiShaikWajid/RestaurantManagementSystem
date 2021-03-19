-- view all previous table requests

select table_id,start_time,end_time,status from table_request where customer_id=<customer_id>;