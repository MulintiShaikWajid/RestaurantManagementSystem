create function temp1() returns trigger as 
$$
begin
insert into notifications
select 'The following item has fallen below threshold'||new.name||'threshold is'||cast(new.threshold as text)||'quantity remaining is'||cast(new.quantity_remaining as text),now(),staff.id from staff where role_name='manager' ;
return new
end;
$$
language plpgsql;




create trigger low_inventory after update or insert of inventory
referencing new row as nrow
for each row
when nrow.quantity_remaining<nrow.threshold
execute procedure temp1();



