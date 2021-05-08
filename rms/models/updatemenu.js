const pool = require('../utils/database');

module.exports = class Updatemenu{
    // constructor(){
    // }
    static items(){
        return pool.query("select * from item,\
            (select item_item_tag.item_id,string_agg(item_tag.type,', ') as tags from item_tag,item_item_tag \
            where item_tag.id=item_item_tag.tag_id group by item_id) as A,\
            (select item_id,string_agg(name_qua,', ') as inventory from \
            (select item_id,concat(name,' ',quantity_needed,units) as name_qua from item_inventory,inventory where item_inventory.inventory_id=inventory.id) as B \
            group by item_id) as C \
            where item.id=A.item_id and item.id=C.item_id order by item.name;");
    }
    static get_item(id){
        return pool.query("select item.id,item.name,item.price,inventory_id,quantity_needed,tag_id\
         from item,item_tag,item_item_tag,inventory,item_inventory \
         where item.id=item_item_tag.item_id and item_item_tag.tag_id=item_tag.id and \
         inventory.id=item_inventory.inventory_id and item.id=item_inventory.item_id and item.id=$1;",[id])
    }
    static all_inven(){
        return pool.query("select * from inventory;");
    }
    static all_tags(){
        return pool.query("select * from item_tag;");
    }
    static delete_tag(item_id){
        return pool.query("delete from item_item_tag where item_id=$1;",[item_id]);
    }
    static insert_tag(item_id,tag_id){
        return pool.query("insert into item_item_tag values ($1,$2);",[item_id,tag_id]);
    }
    static delete_inven(item_id){
        return pool.query("delete from item_inventory where item_id=$1;",[item_id]);
    }
    static delete_item(id){
        return pool.query("delete from item where id = $1;",[id]);
    }
    static insert_inven(item_id,inven_id,quan){
        return pool.query("insert into item_inventory values ($1,$2,$3);",[item_id,inven_id,quan]);
    }
    static update_item(item_id,name,price){
        return pool.query("update item set name=$2,price=$3 where id=$1;",[item_id,name,price]);
    }
    static get_newid(){
        return pool.query("select max(id)+1 as new_id from item;");
    }
    static new_item(item_id,name,price){
        return pool.query("insert into item values ($1,$2,$3);",[item_id,name,price]);
    }
    static checknewitem(name){
        return pool.query("select count(*) as item_count from item where name = $1", [name]);
    }
    static checkolditem(name, id){
        return pool.query("select count(*) as item_count from item where name = $1 and id != $2", [name, id]);
    }
    static insert_tag_bulk(req, id){
        var tag_string = "insert into item_item_tag values";
        for(var key in req.body){
            if(key.length<4){
                continue;
            }
            if(key.substr(0,4)=="tag_"){
                tag_string = tag_string+" ("+id+","+req.body[key]+"),";
            }
        }
        if(tag_string[tag_string.length-1] == ","){
            tag_string = tag_string.substring(0, tag_string.length-1);
            tag_string = tag_string+";";
        }else{
            tag_string = "select * from staff limit 1";
        }
        return pool.query(tag_string);
    }
    static insert_inven_bulk(req, id){
        var inven_string = "insert into item_inventory values";
        for(var key in req.body){
            if(key.length<4){
                continue;
            }
            if(key.substr(0,6)=="inven_" && req.body[key]!=''){
                inven_string = inven_string+" ("+id+","+key.substr(6)+","+req.body[key]+"),";
            }
        }
        if(inven_string[inven_string.length-1] == ","){
            inven_string = inven_string.substring(0, inven_string.length-1);
            inven_string = inven_string+";";
        }else{
            inven_string = "select * from staff limit 1";
        }
        return pool.query(inven_string);
    }
}