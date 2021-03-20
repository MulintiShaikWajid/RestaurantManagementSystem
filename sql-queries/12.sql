--adding to staff and person
  insert into person (username,password,name) values (value1,value2,value3);
  insert into staff values (value1,value2,value3,value4);
  --for each time slot 
    insert into staff_time_slot values (given_staff_id,time_slot_id);
  
--deleting staff
  delete from staff where id = given_id; 
  
--list of items
  select username,role_name from staff;
  --list of time slots for each staff user
  select start_time,end_time from time_slot,staff_time_slot where staff_time_slot.staff_id = "given_value" and staff_time_slot.time_slot_id = time_slot.id;
 
