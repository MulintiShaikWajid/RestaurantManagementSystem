const pool = require('../utils/database');
const Person = require('../models/person');
const Updatestaff = require('../models/updatestaff');
const crypto = require('crypto');
const { body } = require('express-validator');

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
                    Updatestaff.staff().then((result3)=>{
                        res.render('updatestaff',{name : result.rows[0]['name'],staff:result3.rows});
                    })
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
                    Updatestaff.getstaffdetails(req.params.id).then((result3)=>{
                        Updatestaff.gettimeslotdetails(req.params.id).then((result4)=>{
                            res.render('one_staff', {id: req.params.id, info: result3.rows[0], timeslots:result4.rows,
                             tags:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]});
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
                       res.render('new_staff',{err:false, tags:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]});
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
                        if(!(req.body.role == 'cashier' || req.body.role == 'head-waiter')){
                            res.render('error_item',{err: true, err_msg: "**Updating unsucessful: Role should be either Cashier or Head waiter.", 
                            err_head: "Invalid input data observed while updating the staff:", err_foot: "Use back button of browser to get back to the update staff page."});
                            return;
                        }
                        var count = 0;
                        for(var key in req.body){
                            if(key.length<4){
                                continue;
                            }
                            if(key.substr(0,4)=="tag_"){
                                count++;
                            }
                        }
                        if(count == 0){
                            res.render('error_item',{err: true, err_msg: "**Updating unsucessful: Atleast one time slot should be checked.", 
                            err_head: "Invalid input data observed while updating the staff:", err_foot: "Use back button of browser to get back to the update staff page."});
                            return;
                        }

                        Updatestaff.partialupdate(req.params.id, req.body.salary, req.body.dob, req.body.role).then((result3)=>{
                            Updatestaff.delete_timeslots(req.params.id).then(()=>{
                                Updatestaff.bulk_timeslots(req.params.id, req.body).then(()=>{
                                    res.redirect('/updatestaff');
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
                        Updatestaff.delete_staff(req.body.id).then(()=>{
                            res.redirect('/updatestaff'); 
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
                        if(!(req.body.role == 'cashier' || req.body.role == 'head-waiter')){
                            res.render('error_item',{err: true, err_msg: "**Adding unsucessful: Role should be either Cashier or Head waiter.", 
                            err_head: "Invalid input data observed while adding the staff:", err_foot: "Use back button of browser to get back to the add staff page."});
                            return;
                        }
                        var count = 0;
                        for(var key in req.body){
                            if(key.length<4){
                                continue;
                            }
                            if(key.substr(0,4)=="tag_"){
                                count++;
                            }
                        }
                        if(count == 0){
                            res.render('error_item',{err: true, err_msg: "**Adding unsucessful: Atleast one time slot should be checked.", 
                            err_head: "Invalid input data observed while adding the staff:", err_foot: "Use back button of browser to get back to the add staff page."});
                            return;
                        }
                        Updatestaff.checknewstaff(req.body.username).then((result3)=>{
                            if(result3.rows[0]['item_count'] > 0){
                                res.render('error_item',{err: true, err_msg: "**Adding unsucessful: Username '"+req.body.username+"' already exists. Use an unused username.", 
                                err_head: "Invalid input data observed while adding the staff:", err_foot: "Use back button of browser to get back to the add staff page."});
                                return;
                            }
                            
                            var hashed_password = crypto.createHash('sha256').update(req.body.password+'squirrel').digest('hex');
                            Updatestaff.new_person(req.body['username'],req.body.name, hashed_password).then(()=>{
                                Updatestaff.get_newid().then((ans)=>{
                                    Updatestaff.new_staff(ans.rows[0]['new_id'],req.body['salary'],req.body.dob, req.body.role).then(()=>{
                                        Updatestaff.bulk_timeslots(ans.rows[0]['new_id'],req.body).then(()=>{
                                            res.redirect('/updatestaff'); 
                                        })
                                    })                               
                                })  
                            })
                        })
                    }
                })
        }
    }
