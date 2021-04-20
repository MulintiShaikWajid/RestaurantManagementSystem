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
                                res.render('one_item',{item_tags:item_tags,item_inven:item_inven,inven_qua:inven_qua,inven:inven.rows,tags:tags.rows,item:item.rows[0]});
                            })
                        })
                    })
                }
            })}
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
                        // console.log(req.body);
                        Updatemenu.update_item(req.params.id,req.body['name'],req.body['price']);
                        Updatemenu.delete_inven(req.params.id);
                        Updatemenu.delete_tag(req.params.id);
                        for (var key in req.body){
                            if(key.length<4){
                                continue;
                            }
                            if(key.substr(0,4)=="tag_"){
                                Updatemenu.insert_tag(req.params.id,req.body[key]);
                            }
                            if(key.substr(0,6)=="inven_" && req.body[key]!=''){
                                Updatemenu.insert_inven(req.params.id,key.substr(6),req.body[key]);
                            }
                        }
                        res.redirect('/updatemenu');
                    }
        })
    }
}