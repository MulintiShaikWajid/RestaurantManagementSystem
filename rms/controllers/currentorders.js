const pool = require('../utils/database');
const Person = require('../models/person');
const Currentorders = require('../models/currentorders');

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
                    Currentorders.orders().then((result3)=>{
                        Currentorders.offlineorders().then((result5)=>{
                            Currentorders.tables().then((result4)=>{
                                res.render('currentorders',{offlineorders: result5.rows,name : result.rows[0]['name'],orders:result3.rows,tables:result4.rows});
                            })
                        })
                    })
                }
            }
        )
    }
}
