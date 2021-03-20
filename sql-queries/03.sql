---display of items in menu :
select * from (select item.id,name,price,type,rating from item_tag,item_item_tag,item where 
              item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id) as B,
              left outer join (select 1.0*sum(stars)/count(order_id) as rating,item_id from rating group by item_id) 
              as A on A.item_id=B.id; 


---deisplay of items in menu with search fields: 
select * from (select item.id,name,price,type,rating from item_tag,item_item_tag,item where 
              item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id) as B,
              left outer join (select 1.0*sum(stars)/count(order_id) as rating,item_id from rating group by item_id) 
              as A on A.item_id=B.id; search_field=___input___;

---Add to cart button : 
insert into cart(customer_id,item_id,quantity) values (___from web-page____);
