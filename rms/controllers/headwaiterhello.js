const pool = require('../utils/database');
const Person = require('../models/person');
const Headwaiterhello = require('../models/headwaiterhello');

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