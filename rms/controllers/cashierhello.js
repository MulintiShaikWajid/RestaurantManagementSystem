const pool = require('../utils/database');
const Person = require('../models/person');
const Cashierhello = require('../models/cashierhello');

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
                        if(result2.rows[0]['role_name']!="cashier"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Cashierhello.pending_payments().then((result3)=>{
                        Cashierhello.pending_offline_payments().then((result4)=>{
                            res.render('cashierhello',{id: result.rows[0]['id'], name : result.rows[0]['name'], pending_payments:result3.rows
                            , pendingofflinepayments:result4.rows});
                            return;
                        })
                    })
                }
            }
        )
    }
}

exports.post_page = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="cashier"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Cashierhello.complete_payment(req.body.order_id, req.body.amount_paid).then(()=>{
                        Cashierhello.add_rcoins(req.body.username, req.body.amount_paid).then(()=>{
                            Cashierhello.add_complete_time(req.body.order_id).then(()=>{
                                Cashierhello.update_order_status(req.body.order_id).then(()=>{
                                    res.redirect('/cashierhello');
                                    return;
                                })
                            })
                        })
                    })
                }
            }
        )
    }
}


exports.offlineorderpayment = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(result2.rows[0]['role_name']!="cashier"){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Cashierhello.complete_payment(req.body.order_id, req.body.amount_paid).then(()=>{
                        Cashierhello.add_complete_time(req.body.order_id).then(()=>{
                            Cashierhello.update_order_status(req.body.order_id).then(()=>{
                                res.redirect('/cashierhello');
                                return;
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
                    Cashierhello.logout(result.rows[0]['id']).then(
                        (result1)=>{
                            res.redirect('/login');
                        }
                    )
                }
            }
        )
    }
}

