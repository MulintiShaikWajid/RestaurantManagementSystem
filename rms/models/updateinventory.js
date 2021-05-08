const pool = require('../utils/database');

module.exports = class Updateinventory{
        // constructor(){
        // }
        static items(){
            return pool.query('select * from inventory order by name;');
        }
        static checknewingredient(name){
            return pool.query("select count(*) as item_count from inventory where name = $1", [name]);
        }
        static get_newid(){
            return pool.query("select max(id)+1 as new_id from inventory;");
        }
        static new_ingredient(id, name, units, quan_remain, threshold){
            return pool.query("insert into inventory values ($1, $2, $3, $4, $5);", [id, name, quan_remain, threshold, units]);
        }
        static getingredientdetails(id){
            return pool.query("select * from inventory where id = $1;", [id]);
        }
        static checkolditem(name, id){
            return pool.query("select count(*) as item_count from inventory where name = $1 and id != $2", [name, id]);
        }
        static update_item(id, name, quan_remain, threshold, units){
            return pool.query("update inventory set name = $2, quantity_remaining = $3, threshold = $4, units = $5 where \
            id = $1;", [id, name, quan_remain, threshold, units]);
        }
        static delete_item(id){
            return pool.query("delete from inventory where id = $1;", [id]);
        }


    }