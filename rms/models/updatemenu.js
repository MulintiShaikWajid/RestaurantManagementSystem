const pool = require('../utils/database');

module.exports = class Updatemenu{
    // constructor(){
    // }
    static items(){
        return pool.query("select * from item,\
            (select item_item_tag.item_id,string_agg(item_tag.type,',') as tags from item_tag,item_item_tag \
            where item_tag.id=item_item_tag.tag_id group by item_id) as A,\
            (select item_id,string_agg(name_qua,',') as inventory from \
            (select item_id,concat(name,' ',quantity_needed,units) as name_qua from item_inventory,inventory where item_inventory.inventory_id=inventory.id) as B \
            group by item_id) as C \
            where item.id=A.item_id and item.id=C.item_id;");
    }
    // 'INSERT INTO cart(user_id,item_id,quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id,item_id) DO NOTHING;',[1,this.item_id,0]);
// 'INSERT INTO orders(user_id,item_id,quantity) SELECT user_id,item_id,quantity FROM cart ON CONFLICT (user_id,item_id) DO UPDATE SET quantity=orders.quantity+EXCLUDED.quantity;');

    }