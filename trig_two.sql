create or replace function temp2() returns trigger as 
$$
begin
insert into notification values(cast((nrow.rcoins-orow.rcoins) as text)||' rcoins have been added to your account, the new total is '||cast(nrow.rcoins as text),now(),nrow.id);
return new;
end;
$$
language plpgsql;




create trigger gift after update of rcoins on customer
for each row
when (new.rcoins>old.rcoins)
execute procedure temp2();



