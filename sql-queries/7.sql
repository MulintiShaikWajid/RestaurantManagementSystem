--edit password
update person set password = <given_hashed_password> where id = <person_id>;
--edit name
update person set name = <edited_name> where id = <person_id>;
--edit house_no
update person set address_house_no = <edited_house_no> where id = <person_id>;;
--edit street
update person set address_street = <edited_street> where id = <person_id>;
--edit city
update person set address_city = <edited_city> where id = <person_id>;
--edit state
update person set address_state = <edited_state> where id = <person_id>;
--edit country
update person set address_country = <edited_country> where id = <person_id>;
--edit PIN
update person set address_pin_code = <edited_pin_code> where id = <person_id>;
--edit phone_numbers
	-- find which phone numbers are added and which are deleted and then apply sql statements below for each one of those
	--add phone number
	insert into phone values(<person_id>, <new_phone_number>);
	--delete phone number
	delete from phone where id = <person_id> and phone_number = <old_phone_number>;
