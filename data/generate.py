import hashlib
import string
import random
import datetime
digits = [str(x) for x in range(10)]
letters = string.ascii_lowercase
for i in range(2):
    letters = letters+letters
def rs(sz):    # stands for random string, 1<=sz<=26
    
    return "'"+ "".join(random.sample(letters,k=sz))+ "'"

def rd(sz):  # stands for random digits
    ans = ""
    for _ in range(sz):
        ans = ans + random.choice(digits)
    return "'"+ans+"'"

def get_role(id):
    if id%3==0:
        return "'manager'"
    elif id%3==1:
        return "'head-waiter'"
    else:
        return "'cashier'"

def rt():
    temp = random.randint(1,4)
    if temp==1:
        return "'2000-01-01 12:00:00'"
    elif temp==2:
        return "'2000-02-01 13:00:00'"
    elif temp==3:
        return "'2001-01-01 20:00:00'"
    else:
        return "'2010-01-01 8:00:00'"

def myget1(i):
    return f"'{str(i)}-01-01 20:00:00'"

def myget2(i):
    return f"'{str(i)}-01-01 20:30:00'"

# Parameters
# constraints numTags>=2, numInventory>=3, numItems>=4, numTables>=3 numOrders%3=0
numStaff = 10
numOrders = 99
numItems = 10
numCustomers = 5
maxRcoins = 10
static_salt = "squirrel"
numNotifications = 100
numInventory = 10
numTags = 4
numTables = 10
numRequests = 100
# creating files

person = open("person.csv","w")
phone = open("phone.csv","w")
time_slot = open("time_slot.csv","w")
staff = open("staff.csv","w")
staff_time_slot = open("staff_time_slot.csv","w")
notification = open("notification.csv","w")
customer = open("customer.csv","w")
inventory = open("inventory.csv","w")
item_tag = open("item_tag.csv","w")
item = open("item.csv","w")
item_item_tag = open("item_item_tag.csv","w")
item_inventory = open("item_inventory.csv","w")
cart = open("cart.csv","w")
my_order = open("my_order.csv","w")
order_item = open("order_item.csv","w")
rating = open("rating.csv","w")
my_table = open("my_table.csv","w")
table_order = open("table_order.csv","w")
table_request = open("table_request.csv","w")



# Creating customers and persons simultaneously
# leap of faith that there are no duplicates among different rs(10)
# username is password

customer.write("id,rcoins\n")
person.write("id,username,password,name,address_house_no,address_street,address_city,address_state,address_country,address_pin_code\n")
for i in range(numCustomers):
    customer.write(f"{i},{random.randint(0,maxRcoins)}\n")
    username = rs(10)[1:-1]
    person.write(f"{i},'{username}','{hashlib.sha256((username+static_salt).encode()).hexdigest()}',{rs(10)},{rs(10)},{rs(10)},{rs(10)},{rs(10)},{rs(10)},{rd(6)}\n")


# Creating customers and staff simultaneously

staff.write("id,salary,dob,role_name\n")
for i in range(numCustomers,numCustomers+numStaff):
    staff.write(f"{i},10000,'2000-01-01',{get_role(i)}\n")
    person.write(f"{i},{rs(10)},'{hashlib.sha256((username+static_salt).encode()).hexdigest()}',{rs(10)},{rs(10)},{rs(10)},{rs(10)},{rs(10)},{rs(10)},{rd(6)}\n")

# inserting into phone numbers

phone.write("id,phone_number\n")
for i in range(numStaff+numCustomers):
    phone.write(f"{i},{rd(10)}\n")

# inserting into time_slot

time_slot.write("id,start_time,end_time\n")

# only four timeslots

time_slot.write("1,'7:00','9:00'\n")
time_slot.write("2,'10:00','12:00'\n")
time_slot.write("3,'12:00','3:00'\n")
time_slot.write("4,'19:00','22:00'\n")


# inserting into staff_time_slot

staff_time_slot.write("staff_id,time_slot_id\n")

for i in range(numCustomers,numCustomers+numStaff):
    staff_time_slot.write(f"{i},{random.randint(1,4)}\n")


# insering into notification

notification.write("id,info,time_stamp,person_id\n")

for i in range(numNotifications):
    notification.write(f"{i},{rs(100)},{rt()},{random.randint(0,numCustomers+numStaff-1)}\n")


# inserting into inventory

inventory.write("id,name,quantity_remaining,threshold,units\n")

for i in range(numInventory):
    inventory.write(f"{i},{rs(10)},{random.randint(10,20)},{random.randint(1,5)},'kg'\n")

# inserting into tags

item_tag.write("id,type\n")

for i in range(numTags):
    item_tag.write(f"{i},{rs(4)}\n")

# inserting into item

item.write("id,name,price\n")

for i in range(numItems):
    item.write(f"{i},{rs(6)},{random.randint(50,300)}\n")

# inserting into item_item_tags

item_item_tag.write("item_id,tag_id\n")

for i in range(numItems):
    for j in random.sample(range(numTags),k=2):
        item_item_tag.write(f"{i},{j}\n")

# inserting into item inventory

item_inventory.write("item_id,inventory_id,quantity_needed\n")

for i in range(numItems):
    for j in random.sample(range(numInventory),k=3):
        item_inventory.write(f"{i},{j},{random.randint(1,3)}\n")

# inserting into cart

cart.write("customer_id,item_id\n")

for i in range(numCustomers):
    for j in random.sample(range(numItems),k=random.randint(0,4)):
        cart.write(f"{i},{j}\n")

# inserting into order, table_order simultaneously

my_order.write("id,customer_id,ordered_time,served_time,completed_time,amount_paid\n")
table_order.write("order_id,table_id\n")
init_time = datetime.datetime(2021,6,1,10,0,0)
for i in range(0,numOrders-2,3):
    temp_tables = random.sample(range(numTables),k=3)
    serve_delay = datetime.timedelta(minutes=random.randint(10,15))
    time_to_eat = datetime.timedelta(minutes=random.randint(45,60))
    my_order.write(f"{i},{random.randint(0,numCustomers-1)},'{str(init_time)}','{str(init_time+serve_delay)}','{str(init_time+serve_delay+time_to_eat)}',{random.randint(500,1000)}\n")
    table_order.write(f"{i},{temp_tables[0]}\n")
    offset1 = datetime.timedelta(minutes=random.randint(15,20))
    init_time = init_time+offset1
    serve_delay = datetime.timedelta(minutes=random.randint(10,15))
    time_to_eat = datetime.timedelta(minutes=random.randint(45,60))
    my_order.write(f"{i+1},{random.randint(0,numCustomers-1)},'{str(init_time)}','{str(init_time+serve_delay)}','{str(init_time+serve_delay+time_to_eat)}',{random.randint(500,1000)}\n")
    table_order.write(f"{i+1},{temp_tables[1]}\n")
    offset2 = datetime.timedelta(minutes=random.randint(15,20))
    init_time = init_time + offset2
    serve_delay = datetime.timedelta(minutes=random.randint(10,15))
    time_to_eat = datetime.timedelta(minutes=random.randint(45,60))
    my_order.write(f"{i+2},{random.randint(0,numCustomers-1)},'{str(init_time)}','{str(init_time+serve_delay)}','{str(init_time+serve_delay+time_to_eat)}',{random.randint(500,1000)}\n")
    table_order.write(f"{i+2},{temp_tables[2]}\n")
    init_time = init_time+datetime.timedelta(minutes=80)

# inserting into order_item and ratings simultaneously

order_item.write("order_id,item_id,quantity\n")
rating.write("order_id,item_id,stars,review\n")

for i in range(numOrders):
    for j in random.sample(range(numItems),k=3):
        order_item.write(f"{i},{j},{random.randint(1,2)}\n")
        if random.randint(0,1)==1:
            rating.write(f"{i},{j},{random.randint(1,5)},{rs(100)}\n")


# inserting into tables

my_table.write("id,capacity,location,status\n")

for i in range(numTables):
    my_table.write(f"{i},{random.randint(4,8)},'{'window-side' if random.randint(0,1) else 'non-window-side'}','{ 'occupied' if random.randint(0,1) else 'available'}'\n")

# inserting into table_request

table_request.write("request_id,table_id,customer_id,requested_time,start_time,end_time,status\n")
init_time = datetime.datetime(2021,6,1,10,0,0)
delta_time = datetime.timedelta(minutes=60)
small_time = datetime.timedelta(minutes=15)
large_time = datetime.timedelta(minutes=30)
one_month = datetime.timedelta(days=45)
for i in range(numRequests):
    temp = random.randint(0,1)
    status = 'request-placed'
    table_request.write(f"{i},{random.randint(0,numTables-1)},{random.choice(range(numCustomers))},'{init_time}','{init_time+one_month}','{init_time+one_month+delta_time}','{status}'\n")
    init_time = init_time+large_time
