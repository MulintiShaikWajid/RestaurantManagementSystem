drop trigger low_inventory on inventory;
drop function temp1();
create or replace function temp1() returns trigger as 
$$
begin
insert into notification(info,time_stamp,person_id)
(select 'The following item has fallen below threshold'||new.name||'threshold is'||cast(new.threshold as text)||'quantity remaining is'||cast(new.quantity_remaining as text),now(),staff.id from staff where role_name='manager') ;
return new;
end;
$$
language plpgsql;

create trigger low_inventory after update or insert on inventory
for each row
when (new.quantity_remaining<new.threshold)
execute procedure temp1();