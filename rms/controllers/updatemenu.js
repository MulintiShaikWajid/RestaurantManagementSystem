const pool = require('../utils/database');
const Person = require('../models/person');
const Updatemenu = require('../models/updatemenu');

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
            			if(result2.rows[0]['role_name']!="manager"){
            				res.redirect('/error');
            			}
            		})
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                	Updatemenu.items().then((result3)=>{
                        res.render('updatemenu',{name : result.rows[0]['name'],items:result3.rows});
                    });
                }
            }
        )
    }
}

exports.get_item = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="manager"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Updatemenu.get_item(req.params.id).then((item)=>{
                        if(item.rowCount===0){
                            res.render('one_item',{message:"Sorry, the url is invalid"});
                        }
                        item_tags = []
                        item_inven = []
                        inven_qua={}
                        for(var i=0;i<item.rowCount;i++){
                            val = item.rows[i];
                            if(item_tags.indexOf(val['tag_id'])===-1){
                                item_tags.push(val['tag_id']);
                            }
                            if(item_inven.indexOf(val['inventory_id'])===-1){
                                    item_inven.push(val['inventory_id']);
                                    inven_qua[val['inventory_id']]=val['quantity_needed'];
                            }
                        }
                        Updatemenu.all_inven().then((inven)=>{
                            Updatemenu.all_tags().then((tags)=>{
                                res.render('one_item',{err:false,id:req.params.id,item_tags:item_tags,item_inven:item_inven,inven_qua:inven_qua,inven:inven.rows,tags:tags.rows,item:item.rows[0]});
                            })
                        })
                    })
                }
            })
        }
}

exports.new_item = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
                (result)=>{
                    Person.role(result.rows[0]['id']).then(
                        (result2)=>{
                            if(result2.rows[0]['role_name']!="manager"){
                                res.redirect('/error');
                            }
                        })
                    if(result.rowCount===0){
                        res.cookie('redirect',req.url,{signed:true});
                        res.redirect('/login');
                    }
                    else{
                        Updatemenu.all_inven().then((inven)=>{
                            Updatemenu.all_tags().then((tags)=>{
                                res.render('new_item',{err:false, inven:inven.rows,tags:tags.rows});
                            })
                        })
                    }
                })
    }
}

exports.update_item = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
                (result)=>{
                    Person.role(result.rows[0]['id']).then(
                        (result2)=>{
                            if(result2.rows[0]['role_name']!="manager"){
                                res.redirect('/error');
                            }
                        })
                    if(result.rowCount===0){
                        res.cookie('redirect',req.url,{signed:true});
                        res.redirect('/login');
                    }
                    else{
                        Updatemenu.checkolditem(req.body.name, req.params.id).then((result3)=>{
                            if(result3.rows[0]['item_count'] > 0){
                                res.render('error_item',{err: true, err_msg: "**Update unsucessful: Item named '"+req.body.name+"' already exists. Use an unused item name.", 
                                err_head: "Invalid input data observed while updating the item:", err_foot: "Use back button of browser to get back to the update item page."});
                                return;
                            }
                            var price_new = 0;
                            if(req.body.price != ""){price_new = req.body.price;}
                            Updatemenu.update_item(req.params.id,req.body['name'],price_new).then(()=>{
                                Updatemenu.delete_inven(parseInt(req.params.id)).then(()=>{
                                    Updatemenu.delete_tag(parseInt(req.params.id)).then(()=>{
                                        Updatemenu.insert_tag_bulk(req, req.params.id).then(()=>{
                                            Updatemenu.insert_inven_bulk(req, req.params.id).then(()=>{
                                                res.redirect('/updatemenu');
                                            })    
                                        })          
                                    })
                                })
                            })
                        })
                       
                    }
        })
    }
}

exports.delete_item = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
                (result)=>{
                    Person.role(result.rows[0]['id']).then(
                        (result2)=>{
                            if(result2.rows[0]['role_name']!="manager"){
                                res.redirect('/error');
                            }
                        })
                    if(result.rowCount===0){
                        res.cookie('redirect',req.url,{signed:true});
                        res.redirect('/login');
                    }
                    else{
                        Updatemenu.delete_item(req.body.id).then(()=>{
                            res.redirect('/updatemenu'); 
                            return;
                        })
                    }
                })
        }
    }

exports.additem = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
                (result)=>{
                    Person.role(result.rows[0]['id']).then(
                        (result2)=>{
                            if(result2.rows[0]['role_name']!="manager"){
                                res.redirect('/error');
                            }
                        })
                    if(result.rowCount===0){
                        res.cookie('redirect',req.url,{signed:true});
                        res.redirect('/login');
                    }
                    else{
                        Updatemenu.checknewitem(req.body.name).then((result3)=>{
                            if(result3.rows[0]['item_count'] > 0){
                                res.render('error_item',{err: true, err_msg: "**Adding unsucessful: Item named '"+req.body.name+"' already exists. Use an unused item name.", 
                                err_head: "Invalid input data observed while adding the item:", err_foot: "Use back button of browser to get back to the add item page."});
                                return;
                            }
                            Updatemenu.get_newid().then((ans)=>{
                                var price_new = 0;
                                if(req.body.price != ""){price_new = req.body.price;}
                                Updatemenu.new_item(ans.rows[0]['new_id'],req.body['name'],price_new).then(()=>{
                                    Updatemenu.insert_tag_bulk(req, ans.rows[0]['new_id']).then(()=>{
                                        Updatemenu.insert_inven_bulk(req, ans.rows[0]['new_id']).then(()=>{
                                            res.redirect('/updatemenu');
                                        })
                                    })                                
                                })  
                            })
                        })
                    }
                })
        }
    }