--specific previous order
--note: quantity in order_item should not be zero

select I.name, O.total_price/O.quantity, O.quantity, O.total_price, M.status from my_order M, order_item O, item M where M.id = <order_id> and M.id = O.order_id and O.item_id = I.id order by I.name;

--give stars rating, on clicking "rate"

update rating set stars = <given_stars> where order_id = <order_id> and item_id = <item_id>;

--give text review, on clicking "Post review"

update rating set review = <given_review> where order_id = <order_id> and item_id = <item_id>;