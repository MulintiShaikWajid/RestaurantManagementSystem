---delete time slot of a person
  
 delete from staff_time_slot where staff_id = given_s_id and time_slot_id = (select id from time_slot where start_time = given_start_time and end_time = given_end_time);
 
---adding time slot 
  insert into staff_time_slot values (value1,(select id from time_slot where start_time = value2 and end_time = value3));
  
---update time slot
  update staff_time_slot set time_slot_id = " where staff_id = " " 
