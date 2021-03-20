-- search for items

with temp as (select item.name, string_agg(item_tag.type,',' order by asc) as tags,item.price from item,item_item_tag,item_tag where item.id=item_item_tag.item_id and item_tag.id=item_item_tag.tag_id and item.name like '%<search_text>%' group by item.id), select name,tags,price from temp where tags like <tags>; 

-- show items

select item.name, string_agg(item_tag.type,','),item.price from item,item_item_tag,item_tag where item.id=item_item_tag.item_id and item_tag.id=item_item_tag.tag_id group by item.id; 

-- place order

insert into order_item values(<order_id>,<item_id>,<quantity>,<quantity>*(select price from item where item.id=<id>));

insert into my_order values(<id>,<customer_id>,<ordered_time>,null,null,null,null,'order-placed');