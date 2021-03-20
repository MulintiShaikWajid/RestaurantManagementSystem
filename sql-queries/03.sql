---display of items in menu :
select * from (select item.id,name,price,type,rating from item_tag,item_item_tag,item where 
item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id) as B,
left outer join (select 1.0*sum(stars)/count(order_id) as rating,item_id from rating group by item_id) 
as A on A.item_id=B.id;

---sort by alphabetic order
select * from (select item.id,name,price,type,rating from item_tag,item_item_tag,item where 
item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id) as B,
left outer join (select 1.0*sum(stars)/count(order_id) as rating,item_id from rating group by item_id) 
as A on A.item_id=B.id order by name;

---sort by rating
select * from (select item.id,name,price,type,rating from item_tag,item_item_tag,item where 
item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id) as B,
left outer join (select 1.0*sum(stars)/count(order_id) as rating,item_id from rating group by item_id) 
as A on A.item_id=B.id order by rating;

---sort by most ordered
select * from (select * from (select item.id,name,price,type,rating from item_tag,item_item_tag,item where 
item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id) as B,
left outer join (select 1.0*sum(stars)/count(order_id) as rating,item_id from rating group by item_id) 
as A on A.item_id=B.id) as P,(select item_id,count(item_id) as count from order_item group by item_id) as Q 
where Q.item_id=P.id order by count;

---sort by recent ordered
select * from (select * from (select item.id,name,price,type,rating from item_tag,item_item_tag,item where 
item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id) as B,
left outer join (select 1.0*sum(stars)/count(order_id) as rating,item_id from rating group by item_id) 
as A on A.item_id=B.id) as P,(select item_id,max(ordered_time) as time from order_item,my_order where 
order_item.order_id=my_order.id group by item_id) as Q where Q.item_id=P.id order by time;

---display of items in menu with search fields
select * from (select item.id,name,price,type,rating from item_tag,item_item_tag,item where 
item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id) as B,
left outer join (select 1.0*sum(stars)/count(order_id) as rating,item_id from rating group by item_id) 
as A on A.item_id=B.id and search_field=___input___;

---Add to cart button : 
insert into cart(customer_id,item_id,quantity) values (___from web-page____);






