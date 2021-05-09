const { body, validationResult, Result } = require('express-validator');
const Person = require('../models/customer_person');
const Person2 = require('../models/person');
const crypto = require('crypto');
// const pool = require('../utils/database');
exports.login_get = function(req,res,next){
    res.render('login',{});
}

exports.login_post = [
    body('username', 'Username should not be empty').trim().isLength({ min: 1 }).escape(),
    body('password', 'Password should not be empty').trim().isLength({ min: 1 }).escape(),
    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('login',{errors:errors.array()});
            return;
        }
        else{
            // data passed preliminary validation
            var hashed_password = crypto.createHash('sha256').update(req.body.password+'squirrel').digest('hex');
            var person = new Person(req.body.username,hashed_password);
            person.get_details().then(
                (result)=>{
                    if(result.rowCount===0){
                        res.render('login',{message:'Username/Password incorrect'});
                    }
                    else{
                        var session_id = crypto.randomBytes(64).toString('hex');
                        person.update_session_id(session_id).then(
                            ()=>{
                                res.cookie('session_id',session_id,{signed:true});
                                Person2.role(result.rows[0]['id']).then((result2)=>{
                                    Person.check_customer(result.rows[0]['id']).then(
                                        (result)=>{
                                            if(result.rowCount===1){
                                                res.redirect('/customer/hello')
                                            }
                                    });
                                    if(result2.rows[0]['role_name']=='manager'){
                                        res.redirect('/managerhello')
                                    }else if(result2.rows[0]['role_name']=='cashier'){
                                        res.redirect('/cashierhello')   
                                    }else if(result2.rows[0]['role_name']=='head-waiter'){
                                        res.redirect('/headwaiterhello')
                                    }else{
                                        res.redirect('/hello');
                                    }
                                })
                            })
                    }
                }
            )
        }
    }
]
