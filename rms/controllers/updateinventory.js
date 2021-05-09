const pool = require('../utils/database');
const Person = require('../models/person');
const Updateinventory = require('../models/updateinventory');

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
                    Updateinventory.items().then((result3)=>{
                    res.render('updateinventory',{name : result.rows[0]['name'],items:result3.rows});
                   });}
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
                    Updateinventory.getingredientdetails(req.params.id).then((result3)=>{
                        res.render('one_inventory', {id: req.params.id, info: result3.rows[0]});
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
                       res.render('new_inventory',{err:false});
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

                        Updateinventory.checkolditem(req.body.name, req.params.id).then((result3)=>{
                            if(result3.rows[0]['item_count'] > 0){
                                res.render('error_item',{err: true, err_msg: "**Update unsucessful: Ingredient named '"+req.body.name+"' already exists. Use an unused ingredient name.", 
                                err_head: "Invalid input data observed while updating the ingredient:", err_foot: "Use back button of browser to get back to the update ingredient page."});
                                return;
                            }
                            Updateinventory.update_item(req.params.id,req.body['name'],req.body.quan_remain, req.body.threshold,req.body.units).then(()=>{
                               res.redirect('/updateinventory');
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
                        Updateinventory.delete_item(req.body.id).then(()=>{
                            res.redirect('/updateinventory'); 
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
                        Updateinventory.checknewingredient(req.body.name).then((result3)=>{
                            if(result3.rows[0]['item_count'] > 0){
                                res.render('error_item',{err: true, err_msg: "**Adding unsucessful: Ingredient named '"+req.body.name+"' already exists. Use an unused ingredient name.", 
                                err_head: "Invalid input data observed while adding the ingredient:", err_foot: "Use back button of browser to get back to the add ingredient page."});
                                return;
                            }
                            Updateinventory.get_newid().then((ans)=>{
                                Updateinventory.new_ingredient(ans.rows[0]['new_id'],req.body['name'],req.body.units, req.body.quan_remain, req.body.threshold).then(()=>{
                                    res.redirect('/updateinventory');                                
                                })  
                            })
                        })
                    }
                })
        }
    }