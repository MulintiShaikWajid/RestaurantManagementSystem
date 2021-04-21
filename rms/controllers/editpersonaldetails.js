const pool = require('../utils/database');
const Person = require('../models/person');
const Editpersonaldetails = require('../models/editpersonaldetails');

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
                    Editpersonaldetails.get_personal_details(req.body.id).then((result3)=>{
                        Editpersonaldetails.get_phone_numbers(req.body.id).then((result4)=>{
                            res.render('editpersonaldetails',{name : result.rows[0]['name'], id:result.rows[0]['id'], 
                            personal_details: result3.rows, phone_numbers: result4.rows});
                        })
                    })
                }
            }
        )
    }
}

