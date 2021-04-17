--many to many relation while one of it is total participation is not enforced here
DROP TABLE IF EXISTS table_request;
DROP TABLE IF EXISTS table_order;
DROP TABLE IF EXISTS my_table;
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS my_order;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS item_inventory;
DROP TABLE IF EXISTS item_item_tag;
DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS item_tag;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS staff_time_slot;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS time_slot;
DROP TABLE IF EXISTS phone;
DROP TABLE IF EXISTS person;


CREATE TABLE person(
	id int primary key,
	username text not null,
	password text not null,--what say?
	name text not null,
	address_house_no text,
	address_street text,
	address_city text,
	address_state text,
	address_country text,
	address_pin_code text check(address_pin_code ~ '^[0-9]+$'), -- todo: pincode should have only six digits ?
	session_id text,
	unique(username)
);
CREATE TABLE phone(
	id int not null,
	phone_number text not null check(phone_number ~ '^[+]?[0-9 ]+$'), --todo: ten digits ?
	primary key (id, phone_number),
	foreign key (id) references person on delete cascade,
	unique(phone_number)
);
CREATE TABLE time_slot(
	id int primary key,
	start_time time not null,
	end_time time not null
);
CREATE TABLE staff(
	id int primary key,
	salary int not null,
	dob date,
	role_name text check(role_name in ('manager', 'head-waiter', 'cashier')),
	foreign key (id) references person on delete cascade
);
CREATE TABLE staff_time_slot(
	staff_id int not null,
	time_slot_id int not null,
	primary key(staff_id, time_slot_id),
	foreign key (staff_id) references staff on delete cascade,
	foreign key (time_slot_id) references time_slot on delete cascade
);
CREATE TABLE notification(
	id int primary key,
	info text not null,
	time_stamp timestamp not null,
	person_id int not null,
	foreign key (person_id) references person on delete set null--even if person is deleted, notification stays
);
CREATE TABLE customer(
	id int primary key,
	rcoins numeric,
	foreign key (id) references person on delete cascade
);
CREATE TABLE inventory(
	id int primary key,
	name text not null,
	quantity_remaining numeric not null,
	threshold numeric not null,
	units text not null,
	unique(name)
);
CREATE TABLE item_tag(
	id int primary key,
	type text,
	unique(type)
);
CREATE TABLE item(
	id int primary key,
	name text not null,
	price numeric,
	unique(name)
);
CREATE TABLE item_item_tag(
	item_id int,
	tag_id int,
	primary key(item_id, tag_id),
	foreign key (item_id) references item on delete cascade,
	foreign key (tag_id) references item_tag on delete cascade --once item_tag is deleted, corresponding i_i_t entry is deleted
);
CREATE TABLE item_inventory(
	item_id int,
	inventory_id int,
	quantity_needed numeric,
	primary key(item_id, inventory_id),
	foreign key (item_id) references item on delete cascade,
	foreign key (inventory_id) references inventory on delete cascade--once inventory is deleted, corresponding i_i entry is deleted
);
CREATE TABLE cart(
	customer_id int,
	item_id int,
	quantity int not null check (quantity >= 0),
	primary key(customer_id, item_id),
	foreign key (customer_id) references customer on delete cascade,
	foreign key (item_id) references item on delete cascade --once item is deleted, it is automatically removed from cart
);
CREATE TABLE my_order(
	id int primary key,
	customer_id int,--customer_id in order can be null, if head waiter places order
	ordered_time timestamp not null,
	served_time timestamp,
	completed_time timestamp,
	amount_paid numeric,
	rcoins_used numeric,
	status text check(status in ('order-placed', 'order-served', 'order-completed')),
	foreign key (customer_id) references customer on delete set null
);
CREATE TABLE order_item(
	order_id int,
	item_id int,
	quantity int not null check(quantity > 0),
	total_price numeric not null,
	primary key(order_id, item_id),
	foreign key (order_id) references my_order on delete set null,
	foreign key (item_id) references item on delete set null
);
CREATE TABLE rating(
	order_id int,
	item_id int,
	stars int check(stars in (1, 2, 3, 4, 5)),
	review text,
	primary key(order_id, item_id),
	foreign key (order_id) references my_order on delete set null,
	foreign key (item_id) references item on delete cascade, --item ratings will be erased once the item is deleted
	check(stars is not null or review is not null)
);
CREATE TABLE my_table(
	id int primary key,
	capacity int not null,
	location text check(location in ('window-side', 'non-window-side')) not null,--can add any other?
	status text check(status in ('occupied', 'available')) not null
);
CREATE TABLE table_order(
	order_id int,
	table_id int,
	primary key (order_id, table_id),
	foreign key (order_id) references my_order on delete cascade,
	foreign key (table_id) references my_table on delete cascade
);
CREATE TABLE table_request(
	request_id int primary key,
	table_id int,
	customer_id int,
	requested_time timestamp not null,
	start_time timestamp not null,
	end_time timestamp not null,
	status text check(status in ('request-placed', 'request-accepted', 'request-denied')),
	foreign key (table_id) references my_table on delete cascade,
	foreign key (customer_id) references customer on delete cascade--cascading makes finding table-availability-status easy
);

--index

CREATE INDEX table_status_index
ON table_request (status);
			  
CREATE INDEX my_order_status_index
ON my_order(status);

CREATE INDEX username_password_index
ON person (username,password);

--trigger one
create or replace function temp1() returns trigger as 
$$
begin
insert into notifications
select 'The following item has fallen below threshold'||new.name||'threshold is'||cast(new.threshold as text)||'quantity remaining is'||cast(new.quantity_remaining as text),now(),staff.id from staff where role_name='manager' ;
return new;
end;
$$
language plpgsql;

create trigger low_inventory after update or insert on inventory
for each row
when (new.quantity_remaining<new.threshold)
execute procedure temp1();

--trigger two
create or replace function temp2() returns trigger as 
$$
begin
insert into notification values(cast((nrow.rcoins-orow.rcoins) as text)||' rcoins have been added to your account, the new total is '||cast(nrow.rcoins as text),now(),nrow.id);
return new;
end;
$$
language plpgsql;

create trigger gift after update of rcoins on customer
for each row
when (new.rcoins>old.rcoins)
execute procedure temp2();



