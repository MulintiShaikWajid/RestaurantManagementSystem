const Person = require('../models/person');
exports.hello_get = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.my_get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    res.render('hello',{name : result.rows[0]['name']});
                }
            }
        )
    }
}

exports.logout = function(req,res,next){
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Person.logout(req.signedCookies['session_id']).then(
                        ()=>{
                            res.redirect('/login');
                            }).catch(error=>
                        console.log(error));
                    }
                }
            )}
