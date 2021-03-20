---list of records in inventory
select name,threshold,quantity,units from inventory;

---Add inventory
insert into inventory values (inventory_name,threshold,quantity,units)

--update the edited records
update inventory set name = " ",threshold = " ",quantity = " ", units = " " where id = given_id;
