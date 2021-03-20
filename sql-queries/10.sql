--display items
	--item name, price
	select I.name, I.price from items I where I.id = <item_id>;
	--item_tags
	select IT.type from item_tag IT, item_item_tag IIT where IIT.item_id = <item_id> and IIT.tag_id = IT.id;
	--inventory and corresponding quantity
	select I.name, II.quantity_needed from inventory I, item_inventory II where II.item_id = <item_id> and I.id = II.inventory_id;
--add item
	insert into item values(<new_item_id>, <name>, <price>);
	--for each item tag
		--search item_tag
		select count(*) from item_tag where type = <item_tag>;
		--if above count is 0, then insert into item_tag
		insert into item_tag values(<id>, <type>);
	insert into item_item_tag values(<item_id>, <tag_id>);
	--for each inventory
	insert into item_inventory values(<item_id>, <inventory_id>, <quantity_needed>);
--update item
	update item set name = <name> where id = <item_id>;
	update item set price = <price> where id = <item_id>;
	--for each items's item tag
	delete from item_item_tag where item_id = <item_id> and tag_id = <tag_id>;
	insert into item_item_tag values(<old_item_id>, <new_tag_id>);
	--for each items' inventory
	delete from item_inventory where item_id = <item_id> and inventory_id = <inventory_id>;
	insert into item_inventory values(<old_item_id>, <new_inventory_id>, <new_quantity_needed>);