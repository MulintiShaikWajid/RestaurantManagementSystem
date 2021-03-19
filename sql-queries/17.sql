-- get status of tables

select id,location,status from my_table;

-- get details of particular table which have requests placed

select start_time,end_time from table_request where table_id=<table_id> and status=='request-placed';

-- get details of tables which are booked

select start_time,end_time from table_request where table_id=<table_id> and status=='request-accepted';

-- place request to book a table

insert into table_request values(<request_id>,<table_id>,<customer_id>,<requested_time>,<start_time>,<end_time>,'request-placed');

