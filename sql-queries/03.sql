---Search button : 
select name,price,type,rating from item,item_tag,item_item_tag,
                (select 1.0*sum(stars)/count(order_id) as rating,item_id from rating group by item_id) as A where 
                item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id and A.item_id=item.id
                and search_field=___input___;

---Add to cart button : 
insert into cart(customer_id,item_id,quantity) values (___from web-page____);
