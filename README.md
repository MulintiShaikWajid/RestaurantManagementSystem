# RestaurantManagementSystem
Group Project for CS387

| Team Members | Roll No|
|---|---|
| Guttu Sai Abhishek        | 180050036 |
| Mulinti Shaik Wajid       | 180050063 |
| Sai Phanindra Ramasahayam | 180050084 |
| Sanapathi Sumanth Balaji  | 180050091 |


This a website which can be used for managing a restaurant. Note that there is not door delivery option.

Process:
* Clone the project and have node installed
* Create a database and install DDL.sql, restaurant_data.sql
* Make sure that database is running and credentials in rms/utils/database.js are correct
* In rms directory, run 'npm install' and then 'npm run start'
* Now, you can open the website in 'localhost:3000/login'
* Based on login credentials, you will be redirected to customer or manager or head-waiter or cashier hello pages. Everyone with an account can edit their personal details
* We have a terminology called 'online orders', 'offline orders'. The former refer to those orders placed by customer through his/her account. The latter are those orders which are placed by Head waiter for those customers who don't have an account
* Where ever you are, you can get to hello pages using 'localhost:3000/<role>hello' where role can be 'customer/' or 'manager' or 'headwaiter' or 'cashier'
* Customer:
  *
* Manager:
  * Can update items, item tags, ingredients, staff
  * Can see statistics, current orders, table statuses
  * Will get notifications if an ingredient fall below threshold
* Head waiter(HW):
  * Can place offline orders for customer with no account
  * Can see the live status of online, offline orders and change its status once the order is served
  * Can accept/reject the table booking orders of customers
  * Can see live table statuses and change their status in real time. Some protocols:
    1. If a customer who booked the table didn't visit, HW can deny the accepted request and then make the table available so that other customers can book table for current time slot or HW can place offline order
    1. On placing offline order for an available table, table will be automatically changed to occupied and any requests for that table in current timeslot will be denied
* Cashier:
  * Can see pending payments for offline, online orders and click 'Paid' if they are paid

