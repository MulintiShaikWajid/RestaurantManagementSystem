1. ~~Write code to add rows in csv files to corresponding schemas, single quotes around strings,dates,timestamps are already added in csv files to simplify this task~~
2. ~~in phone.csv we have only one row~~
3. ~~in order.csv we dont have column name to last column(which may not be problem for creating insert statements)~~
4. ~~in table_request.csv the column status is empty for all rows, I dont know this but if it is to be NULL we have to write "NULL" in that column right?~~
5. ~~in table_order there are no column names in csv file(which may not be problem for creating insert statements)~~
6. Write constraint that phone number and pincode can contain only digits, add primary key to table_order, can set to cascade in table_order  in DDL.sql
7. Use indices for attributes which are used often
8. opened_file is not closed in insert.py
9. DDL.sql gives errors while running
