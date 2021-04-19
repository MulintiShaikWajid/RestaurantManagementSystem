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
                    res.render('updateinventory',{name : result.rows[0]['name'],items:result3});
                   });}
            }
        )
    }
}

exports.update_inven = function(req,res,next){

}
