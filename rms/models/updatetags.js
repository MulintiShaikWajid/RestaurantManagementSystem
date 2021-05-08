const pool = require('../utils/database');

module.exports = class Updatetags{
    // constructor(){
    // }
    static item_tags(){
        return pool.query("select * from item_tag order by type;");
    }
    static get_newid(){
        return pool.query("select max(id)+1 as new_id from item_tag;");
    }
    static new_item_tag(id, tag_name){
        return pool.query("insert into item_tag values($1, $2);", [id, tag_name]);
    }
    static update_item_tag(id, tag_name){
        return pool.query("update item_tag set type = $2 where id = $1;", [id, tag_name]);
    }
    static checkfortag(tagname){
        return pool.query("select count(*) as tagcount from item_tag where type = $1;", [tagname]);
    }
    static checkforoldtag(tagname, id){
        return pool.query("select count(*) as tagcount from item_tag where type = $1 and id != $2;", [tagname, id]);
    }
    static get_item_tag(id){
        return pool.query("select * from item_tag where id = $1;", [id]);
    }
    static deletetag(id){
        return pool.query("delete from item_tag where id = $1;",[id]);
    }
}