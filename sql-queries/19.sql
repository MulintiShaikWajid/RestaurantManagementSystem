-- search for items

select item.name, string_agg(item_tag.type,','),item.price from item,item_item_tag,item_tag where item.id=item_item_tag.item_id and item_tag.id=item_item_tag.tag_id and item.name like '%<search_text>&' group by item.id; 

-- show items

select item.name, string_agg(item_tag.type,','),item.price from item,item_item_tag,item_tag where item.id=item_item_tag.item_id and item_tag.id=item_item_tag.tag_id group by item.id; 

-- place order

