const pool = require('../utils/database');
const Person = require('../models/person');
const Headwaiterhello = require('../models/headwaiterhello');
const { head } = require('../routes/updatemenu');

exports.get_page = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!='head-waiter'){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Headwaiterhello.get_current_orders().then((result3)=>{
                        Headwaiterhello.get_table_requests().then((result4)=>{
                            Headwaiterhello.get_live_table_status().then((result5)=>{
                                res.render('headwaiterhello',{name : result.rows[0]['name'], id:result.rows[0]['id'], 
                                current_orders: result3.rows, table_requests:result4.rows, table_status: result5.rows});
                            })
                        })
                    })
                }
            }
        )
    }
}

exports.next_order_status = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="head-waiter"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Headwaiterhello.next_order_status(req.body.order_id).then((result3)=>{
                    res.redirect('/headwaiterhello');
                    });
                }
            }
        )
    }
}

exports.accept_table_request = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="head-waiter"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Headwaiterhello.accept_table_request(req.body.request_id).then((result3)=>{
                    res.redirect('/headwaiterhello');
                    })
                }
            }
        )
    }
}

exports.reject_table_request = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="head-waiter"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Headwaiterhello.reject_table_request(req.body.request_id).then((result3)=>{
                    res.redirect('/headwaiterhello');
                    })
                }
            }
        )
    }
}

exports.denytherequest = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="head-waiter"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Headwaiterhello.denytherequest(req.body.request_id_1).then((result3)=>{
                        res.redirect('/headwaiterhello');
                    })
                }
            }
        )
    }
}

exports.changetooccupied = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="head-waiter"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Headwaiterhello.changetooccupied(req.body.table_id_1).then((result3)=>{
                        Headwaiterhello.handleuselessrequests(req.body.table_id_1).then((result4)=>{
                            res.redirect('/headwaiterhello');
                        })
                    })
                }
            }
        )
    }
}

exports.changetoavailable = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="head-waiter"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Headwaiterhello.changetoavailable(req.body.table_id_2).then((result3)=>{
                        res.redirect('/headwaiterhello');
                    })
                }
            }
        )
    }
}

exports.openofflineorder = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="head-waiter"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Headwaiterhello.openofflineorder().then((result3)=>{
                        Headwaiterhello.gettabledetails().then((result4)=>{
                            res.render('offline_order',{info:result3.rows, tabledetails:result4.rows});
                        })
                    })
                }
            }
        )
    }
}


exports.placeorder = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="head-waiter"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    var count = 0;
                    var items = {};
                    var price = {};
                    var inventory = {};
                    for(var key in req.body){
                        if(key.length<5){
                            continue;
                        }
                        if(key.substr(0,5)=="item_"){
                            if(req.body[key] != '0'){
                                count++;
                                items[parseInt(key.substring(5))] = parseInt(req.body[key]);
                                //console.log(items[parseInt(key.substring(5))]);
                            }
                        }
                    }
                    //console.log(items);
                    if(count == 0){
                        res.render('error_item',{err: true, err_msg: "**Order placement unsucessful: Atleast one item should be in the order.", 
                                err_head: "Invalid input data observed while ordering:", err_foot: "Use back button of browser to get back to the place order page."});
                        return;
                    }
                    Headwaiterhello.checktable(req.body.tableid).then((result3)=>{
                        if(result3.rows.length == 0){
                            res.render('error_item',{err: true, err_msg: "**Order placement unsucessful: Table id '"+req.body.tableid+"' is non existent.", 
                                err_head: "Invalid input data observed while ordering:", err_foot: "Use back button of browser to get back to the place order page."});
                            return;
                        }else if(result3.rows[0]['status'] == 'occupied'){
                            res.render('error_item',{err: true, err_msg: "**Order placement unsucessful: Table id '"+req.body.tableid+"' is occupied.", 
                                err_head: "Invalid input data observed while ordering:", err_foot: "Use back button of browser to get back to the place order page."});
                            return;
                        }
                        
                        Headwaiterhello.getallitemdetails().then((result4)=>{
                            Headwaiterhello.getallingredientdetails().then((result5)=>{
                                var is_abort = false;
                                for(var item in items){
                                    for(var item_inven in result4.rows){
                                        if(item == result4.rows[item_inven]['item_id']){
                                            if(result4.rows[item_inven]['inventory_id'] in inventory){
                                                inventory[result4.rows[item_inven]['inventory_id']] += result4.rows[item_inven]['quantity_needed']*items[item];
                                            }else{
                                                inventory[result4.rows[item_inven]['inventory_id']] = result4.rows[item_inven]['quantity_needed']*items[item];
                                            }
                                            price[item] = result4.rows[item_inven]['price']*items[item];
                                        }
                                    }
                                }
                                for(var inven in inventory){
                                    for(var one_inven in result5.rows){
                                        if(one_inven == inven){
                                            //console.log("hi ",one_inven, inven)
                                            if(inventory[inven] > parseInt(result5.rows[one_inven]['quantity_remaining'])){
                                                //console.log(inventory[inven], parseInt(result5.rows[one_inven]['quantity_remaining']))
                                                is_abort = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                // console.log(items);
                                // console.log(price);
                                // console.log(inventory);
                                if(is_abort){
                                    res.render('error_item',{err: true, err_msg: "**Order placement unsucessful: Required amount of ingredients are not available.", 
                                            err_head: "Invalid input data observed while ordering:", err_foot: "Use back button of browser to get back to the place order page."});
                                    return;
                                }
                                Headwaiterhello.changetooccupied(req.body.tableid).then(()=>{
                                    Headwaiterhello.handleuselessrequests(req.body.tableid).then(()=>{
                                        Headwaiterhello.getneworderid().then((result6)=>{
                                            Headwaiterhello.insertorder(result6.rows[0]['newid']).then(()=>{
                                                Headwaiterhello.insertorderitem(result6.rows[0]['newid'], items, price).then(()=>{
                                                    Headwaiterhello.removeingredients(inventory).then(()=>{
                                                        res.redirect('/headwaiterhello');
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                        
                    })
                    
                }
            }
        )
    }
}


exports.logout = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Headwaiterhello.logout(result.rows[0]['id']).then(
                        (result1)=>{
                            res.redirect('/login');
                        }
                    )
                }
            }
        )
    }
}