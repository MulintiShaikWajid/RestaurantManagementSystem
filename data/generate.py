import random
random.seed(0)
import csv

from faker import Faker  # Faker can be used to generate fake profiles
fake = Faker('en_US')  # localized to indian hindi so that indian names and street names appear, the downside is that the output will be in devnagari script

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

def get_role():
    id = random.randint(1,3)
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
numOrders = 1000
numItems = 10
numCustomers = 1000
maxRcoins = 100
static_salt = "squirrel"
numNotifications = 1000
numInventory = 10
numTags = 4
numTables = 25
numRequests = 1000




# opening files to save data
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


# Populating customer and persons

customer.write("id,rcoins\n")
person.write("id,username,password,name,address_house_no,address_street,address_city,address_state,address_country,address_pin_code,session_id\n")
for i in range(numCustomers):
    prof = fake.profile()
    username = fake.unique.text(max_nb_chars=10)
    person.write(f"DEFAULT,'{username}','{hashlib.sha256((username+static_salt).encode()).hexdigest()}','{prof['name']}','{fake.street_address()}','{fake.street_name()}','{fake.city()}','{fake.state()}','{'United States'}','{fake.zipcode()}',NULL\n")
    customer.write(f"{i+1},{random.randint(0,maxRcoins)}\n")
    

staff.write("id,salary,dob,role_name\n")
for i in range(numCustomers,numCustomers+numStaff):
    prof = fake.profile()
    username = fake.unique.text(max_nb_chars=10)
    person.write(f"DEFAULT,'{username}','{hashlib.sha256((username+static_salt).encode()).hexdigest()}','{prof['name']}','{fake.street_address()}','{fake.street_name()}','{fake.city()}','{fake.state()}','{'United States'}','{fake.zipcode()}',NULL\n")
    staff.write(f"{i+1},{random.randint(10000,20000)},'{str(fake.date_of_birth())}',{get_role()}\n")
    

phone.write("id,phone_number\n")
for i in range(numStaff+numCustomers):
    for _ in range(2):
        phone.write(f"{i+1},{rd(10)}\n")
        if random.randint(1,2)==1:
            break


# time_slot.write("id,start_time,end_time\n")

# # only four timeslots

# time_slot.write("1,'7:00','9:00'\n")
# time_slot.write("2,'10:00','12:00'\n")
# time_slot.write("3,'12:00','3:00'\n")
# time_slot.write("4,'19:00','22:00'\n")

staff_time_slot.write("staff_id,time_slot_id\n")

for i in range(numCustomers,numCustomers+numStaff):
    staff_time_slot.write(f"{i+1},{random.randint(0,23)}\n")


notification.write("id,info,time_stamp,person_id\n")

for i in range(numNotifications):
    notification.write(f"DEFAULT,'{fake.paragraph(nb_sentences=2)}','{fake.date_time_this_month()}',{random.randint(1,numCustomers+numStaff)}\n")



# reading indian_food.csv

indian_food = open('indian_food.csv','r')

ingredients = []

data = csv.DictReader(indian_food)
for row in data:
    ingredients = ingredients+row['ingredients'].split(',')
ingredients = list(set(ingredients))
ingredients.sort()
inventory.write("id,name,quantity_remaining,threshold,units\n")

for i in range(len(ingredients)):
    inventory.write(f"{i},'{ingredients[i]}',{random.randint(10,20)},{random.randint(1,5)},'kg'\n")

tags = []
indian_food.seek(0)
data = csv.DictReader(indian_food)
for row in data:
    if row['state'] != '-1':
        tags.append(row['state'])
    if row['diet'] != '-1':
        tags.append(row['diet'])
    if row['course'] != '-1':
        tags.append(row['course'])
    if row['flavor_profile'] != '-1':
        tags.append(row['flavor_profile'])
tags = list(set(tags))
tags.sort()

item_tag.write("id,type\n")

for i in range(len(tags)):
    item_tag.write(f"{i},'{tags[i]}'\n")

indian_food.seek(0)
data = csv.DictReader(indian_food)

item.write("id,name,price\n")
item_item_tag.write("item_id,tag_id\n")
item_inventory.write("item_id,inventory_id,quantity_needed\n")
sa = 0
menu = {}
for row in data:
    price = random.randint(50,300)
    menu[sa] = price
    item.write(f"{sa},'{row['name']}',{price}\n")
    mytags = []
    if row['state'] != '-1':
        mytags.append(row['state'])
    if row['diet'] != '-1':
        mytags.append(row['diet'])
    if row['course'] != '-1':
        mytags.append(row['course'])
    if row['flavor_profile'] != '-1':
        mytags.append(row['flavor_profile'])
    for x in mytags:
        item_item_tag.write(f"{sa},{tags.index(x)}\n")
    ingds = row['ingredients'].split(",")
    for x in ingds:
        item_inventory.write(f"{sa},{ingredients.index(x)},{random.randint(1,3)}\n")
    sa += 1

numItems = sa
numTags = len(tags)
numInventory = len(ingredients)
cart.write("customer_id,item_id,quantity\n")

for i in range(numCustomers):
    for j in random.sample(range(numItems),k=random.randint(0,4)):
        cart.write(f"{i+1},{j},{random.randint(1,4)}\n")

my_order.write("id,customer_id,ordered_time,served_time,completed_time,amount_paid,rcoins_used,status\n")
table_order.write("order_id,table_id\n")
order_item.write("order_id,item_id,quantity,total_price\n")
rating.write("order_id,item_id,stars,review\n")
init_time = datetime.datetime(2021,6,1,10,0,0)
for i in range(0,numOrders-2,3):
    temp_tables = random.sample(range(numTables),k=3)
    serve_delay = datetime.timedelta(minutes=random.randint(10,15))
    time_to_eat = datetime.timedelta(minutes=random.randint(45,60))
    myitems = random.sample(range(numItems),k=3)
    myquant = [random.randint(1,3),random.randint(1,3),random.randint(1,3)]
    total_price = sum([menu[x]*y for x,y in zip(myitems,myquant)])
    amount_paid = random.randint(0,total_price)
    rcoins_used = total_price-amount_paid
    my_order.write(f"DEFAULT,{random.randint(1,numCustomers)},DEFAULT,'{str(init_time+serve_delay)}','{str(init_time+serve_delay+time_to_eat)}',{amount_paid},{rcoins_used},'order-completed'\n")
    table_order.write(f"{i+1},{temp_tables[0]}\n")
    myquant.reverse()
    for x in myitems:
        mytemp = myquant.pop()
        order_item.write(f"{i+1},{x},{mytemp},{mytemp*menu[x]}\n")
        if random.randint(0,1)==1:
            rating.write(f"{i+1},{x},{random.randint(1,5)},'{fake.paragraph(nb_sentences=2)}'\n")

    offset1 = datetime.timedelta(minutes=random.randint(15,20))
    init_time = init_time+offset1
    serve_delay = datetime.timedelta(minutes=random.randint(10,15))
    time_to_eat = datetime.timedelta(minutes=random.randint(45,60))
    myitems = random.sample(range(numItems),k=3)
    myquant = [random.randint(1,3),random.randint(1,3),random.randint(1,3)]
    total_price = sum([menu[x]*y for x,y in zip(myitems,myquant)])
    amount_paid = random.randint(0,total_price)
    rcoins_used = total_price-amount_paid
    my_order.write(f"DEFAULT,{random.randint(1,numCustomers)},DEFAULT,'{str(init_time+serve_delay)}','{str(init_time+serve_delay+time_to_eat)}',{amount_paid},{rcoins_used},'order-completed'\n")
    table_order.write(f"{i+2},{temp_tables[1]}\n")
    myquant.reverse()
    for x in myitems:
        mytemp = myquant.pop()
        order_item.write(f"{i+2},{x},{mytemp},{mytemp*menu[x]}\n")
        if random.randint(0,1)==1:
            rating.write(f"{i+2},{x},{random.randint(1,5)},'{fake.paragraph(nb_sentences=2)}'\n")
    offset2 = datetime.timedelta(minutes=random.randint(15,20))
    init_time = init_time + offset2
    serve_delay = datetime.timedelta(minutes=random.randint(10,15))
    time_to_eat = datetime.timedelta(minutes=random.randint(45,60))
    myitems = random.sample(range(numItems),k=3)
    myquant = [random.randint(1,3),random.randint(1,3),random.randint(1,3)]
    total_price = sum([menu[x]*y for x,y in zip(myitems,myquant)])
    amount_paid = random.randint(0,total_price)
    rcoins_used = total_price-amount_paid
    my_order.write(f"DEFAULT,{random.randint(1,numCustomers)},DEFAULT,'{str(init_time+serve_delay)}','{str(init_time+serve_delay+time_to_eat)}',{amount_paid},{rcoins_used},'order-completed'\n")
    table_order.write(f"{i+3},{temp_tables[2]}\n")
    myquant.reverse()
    for x in myitems:
        mytemp = myquant.pop()
        order_item.write(f"{i+3},{x},{mytemp},{mytemp*menu[x]}\n")
        if random.randint(0,1)==1:
            rating.write(f"{i+3},{x},{random.randint(1,5)},'{fake.paragraph(nb_sentences=2)}'\n")
    init_time = init_time+datetime.timedelta(minutes=80)

my_table.write("id,capacity,location,status\n")

for i in range(numTables):
    my_table.write(f"{i},{random.randint(4,8)},'{'window-side' if random.randint(0,1) else 'non-window-side'}','{ 'occupied' if random.randint(0,1) else 'available'}'\n")


table_request.write("request_id,table_id,customer_id,requested_time,booked_day,time_slot,status\n")
init_time = datetime.datetime(2021,6,1,10,0,0)
delta_time = datetime.timedelta(minutes=60)
small_time = datetime.timedelta(minutes=15)
large_time = datetime.timedelta(minutes=30)
one_month = datetime.timedelta(days=45)
tempdate = datetime.date.today()
for i in range(numRequests):
    temp = random.randint(0,1)
    status = 'request-placed'
    table_request.write(f"DEFAULT,{random.randint(0,numTables-1)},{random.choice(range(1,numCustomers+1))},'{init_time}','{tempdate.__str__()}',{random.randint(0,23)},'{status}'\n")
    # init_time = init_time+large_time
    tempdate+datetime.timedelta(days=1)

person.close()
phone.close()
time_slot.close()
staff.close()
staff_time_slot.close()
notification.close()
customer.close()
inventory.close()
item_tag.close()
item.close()
item_item_tag.close()
item_inventory.close()
cart.close()
my_order.close()
order_item.close()
rating.close()
my_table.close()
table_order.close()
table_request.close()
