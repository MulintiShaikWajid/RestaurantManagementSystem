---View/Rate button - just change in webpage

---display of previous orders
select * from my_order where my_order.customer_id=____from web-page____;

---pay using rcoins button
update customer set rcoins=(select rcoins from customer where id=____from web-page____)-___input___ where id=____from web-page____;
