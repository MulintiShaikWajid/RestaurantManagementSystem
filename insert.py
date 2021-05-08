import csv

req_file=open("restaurant_data.sql","w")
req_file.write("delete from person;\n")
req_file.write("delete from phone;\n")
req_file.write("delete from staff;\n")
req_file.write("delete from staff_time_slot;\n")
req_file.write("delete from notification;\n")
req_file.write("delete from customer;\n")
req_file.write("delete from inventory;\n")
req_file.write("delete from item_tag;\n")
req_file.write("delete from item;\n")
req_file.write("delete from item_item_tag;\n")
req_file.write("delete from item_inventory;\n")
req_file.write("delete from cart;\n")
req_file.write("delete from my_order;\n")
req_file.write("delete from order_item;\n")
req_file.write("delete from rating;\n")
req_file.write("delete from my_table;\n")
req_file.write("delete from table_order;\n")
req_file.write("delete from table_request;\n")
req_file.close()

for table in ["person","phone","time_slot","staff","notification","customer","inventory","item_tag","item","item_item_tag","item_inventory","cart","my_order","order_item","rating","my_table","table_order","table_request"]:
	opened_csv=open("./data/"+table+".csv")
	reader=csv.DictReader(opened_csv)
	req_file=open("restaurant_data.sql","a")
	for r in reader:
		ans="insert into "+table+" values ("
		for k in r:
			if r[k]!='NULL':
				ans=ans+r[k]+','+' '
			else:
				ans=ans+'NULL'+','+' '
		ans=ans[:-2]
		ans=ans+')'+';'
		req_file.write(ans+"\n")
	req_file.close()
	opened_csv.close()
