const { body, validationResult, Result } = require('express-validator');
const person = require('../models/person');
const crypto = require('crypto');
const pool = require('../utils/database');
exports.login_get = function(req,res,next){
    res.render('login',{});
}

exports.login_post = [
    body('username', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    body('password', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log('Bulma');
            res.render('login',{errors:errors.array()});
            return;
        }
        else{
            // data passed preliminary validation
            console.log("Gohan");
            var session_id;
            person.check(req.body.username,req.body.password).then((result)=>{
                if(result.rowCount===0){
                    console.log('Hi')
                    session_id = false;
                }
                else{
                    console.log('Wajid');
                    // create a session_id
                    session_id = crypto.randomBytes(64).toString('hex');
                    console.log(session_id);
                    // insert session_id into database
                    pool.query('update person set session_id=$1 where username=$2',[session_id,req.body.username]).then(()=>{
                if(session_id){
                    console.log('Sajid');
                    // create a session_id and store it in database and also send it with a cookie
                    res.cookie('session',session_id,{signed:true});
                    console.log(session_id);
                    console.log('Vegeta');
                    res.redirect('/hello');
                    return;
                }
                else{
                    console.log('Hello');
                    res.render('login',{message:'Username/Password incorrect'});
                    return;
                }})}
            });
        }
    }
]