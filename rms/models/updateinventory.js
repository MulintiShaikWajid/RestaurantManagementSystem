const pool = require('../utils/database');

module.exports = class Updateinventory{
    // constructor(){
    // }
    static items(){
        return pool.query('select name,threshold,quantity_remaining,units from inventory;');
    }
    // insert into inventory values (inventory_name,threshold,quantity,units)
    // update inventory set name = " ",threshold = " ",quantity = " ", units = " " where id = given_id;
    }