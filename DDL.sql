--many to many relation while one of it is total participation is not enforced here
create TABLE person(
	id int primary key,
	username text not null,
	password text not null,--what say?
	name text not null,
	address_house_no text,
	adderss_street text,
	address_city text,
	adderss_state text,
	address_country text,
	address_pin_code text, -- pincode should have only six digits ?
	unique(username)
)
create TABLE phone(
	id int not null,
	phone_number text not null,  -- ten digits ?
	primary key (id, phone_number),
	foreign key id references person on delete cascade
)
create TABLE time_slot(
	id int primary key,
	start_time time not null,
	end_time time not null
)
create TABLE staff(
	id int primary key,
	salary int not null,
	dob date,
	role_name text check(role_name in ('manager', 'head-waiter', 'cashier')),--what say?
	foreign key id references person on delete cascade,
)
create TABLE s_t(
	staff_id int not null,
	time_slot_id int not null,
	primary key(staff_id, time_slot_id),
	foreign key staff_id references staff on delete,
	foreign key time_slot_id references time_slot on delete cascade
)
create TABLE notification(
	id int primary key,
	info text not null,
	time_stamp timestamp not null,
	person_id int not null,
	foreign key person_id references person on delete set null--even if person is deleted, notification stays
)
create TABLE customer(
	id int primary key,
	rcoins numeric,
	foreign key id references person on delete cascade
)
create TABLE inventory(
	id int primary key,
	name text not null,
	quantity_remaining numeric not null,
	threshold numeric not null,
	units text not null
)
create TABLE item_tag(
	id int primary key,
	type text
)
create TABLE item(
	id int primary key,
	name text not null,
	price numeric 
)
create TABLE i_i_t(
	item_id int,
	tag_id int,
	primary key(item_id, tag_id),
	foreign key item_id references item on delete cascade,
	foreign key tag_id references item_tag on delete cascade --once item_tag is deleted, corresponding i_i_t entry is deleted
)
create TABLE i_i(
	item_id int,
	inventory_id int,
	quantity_needed numeric,
	primary key(item_id, inventory_id),
	foreign key item_id references item on delete cascade,
	foreign key inventory_id references inventory on delete cascade--once inventory is deleted, corresponding i_i entry is deleted
)
create TABLE cart(
	customer_id int,
	item_id int,
	primary key(customer_id, item_id),
	foreign key customer id references customer on delete cascade,
	foreign key item_id references item on delete cascade --once item is deleted, it is automatically removed from cart
)
create TABLE order(
	id int primary key,
	customer_id int,--customer_id in order can be null, if head waiter places order
	ordered_time timestamp not null,
	served_time timestamp,
	completed_time timestamp,
	amount_paid numeric not null,
	status text check(status in ('placing-order', 'order-placed', 'cooking', 'order-served')),
	foreign key customer_id references customer on delete set null
)
create TABLE o_i(
	order_id int,
	item_id int,
	quantity int not null,
	primary key(order_id, item_id)
	foreign key order_id references order on delete set null,
	foreign key item_id references item on delete set null
)
create TABLE rating(
	order_id int,
	item_id int,
	stars int check(stars in (1, 2, 3, 4, 5)),
	review text,
	primary key(order_id, item_id),
	foreign key order_id references order on delete set null,
	foreign key item_id references item on delete cascade, --item ratings will be erased once the item is deleted
	check(stars is not null or review is not null)
)
create TABLE tables(--note the plural for 'tables' TABLE
	id int primary key,
	capacity int not null,
	location text check(location in ('window-side', 'non-window-side')) not null,--can add any other?
	status text check(status in ('occupied', 'available')) not null
)
create TABLE t_o(--no primary because to handle takeaways but do we allow takeaways?
	order_id int,
	table_id int,
	foreign key order_id references order on delete cascade,
	foreign key table_id references table on delete set null--not deleted, can be useful to find if order is takeaway(are we allowing this?)
)
create table table_request(
	request_id int primary key,
	table_id int,
	customer_id int,
	requested_time timestamp not null,
	start_time timestamp not null,
	end_time timestamp not null,
	status text check(status in ('request-placed', 'request-accepted', 'request-denied')),
	foreign key table_id references table on delete cascade,
	foreign key customer_id references customer on delete cascade--cascading makes finding table-availability-status easy
)

