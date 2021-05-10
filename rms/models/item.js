const pool = require('../utils/database');

module.exports = class Item{
    static get_all_items(){
        return pool.query("select round(avg(stars),2) as stars,id,name,price,tags from (select item.id,item.name,item.price,string_agg(item_tag.type,',') as tags from item,item_item_tag,item_tag where item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id group by item.id) as temp,rating where rating.item_id=temp.id group by temp.id,temp.name,temp.price,temp.tags");
    }

    static one_detail(id,user_id){
        return pool.query('select name,price,type,ingredient,coalesce(quantity,0)as quantity from  (select item.id as item_id,item.name as name,item.price,item_tag.type,inventory.name as ingredient from item,item_tag,item_item_tag,item_inventory,inventory where item.id=$1 and item_item_tag.item_id=$1 and item_inventory.item_id=$1 and inventory.id=item_inventory.inventory_id and item_tag.id=item_item_tag.tag_id) as temp left join cart on cart.customer_id=$2 and cart.item_id=temp.item_id',[id,user_id]);
    }
    static update_quantity_of_item(user_id,item_id,new_quantity){
        if(parseInt(new_quantity)===0){
            return pool.query("delete from cart where customer_id=$1 and item_id=$2",[user_id,item_id]);
        }
        return pool.query('insert into cart values($1,$2,$3) on conflict (customer_id,item_id) do update set quantity=$3 where cart.customer_id=$1 and cart.item_id=$2',[user_id,item_id,new_quantity])
    }
    static get_reviews(id){
        return pool.query("select person.name as name, coalesce(stars,-1) as stars,coalesce(review,'Not reviewed') as review from rating,my_order,person where item_id=$1 and rating.order_id=my_order.id and my_order.customer_id=person.id",[id]);
    }
}
