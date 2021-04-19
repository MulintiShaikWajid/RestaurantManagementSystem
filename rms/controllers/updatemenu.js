const pool = require('../utils/database');
const Person = require('../models/person');
const Updatemenu = require('../models/updatemenu');

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
                	Updatemenu.items().then((result3)=>{
                    res.render('updatemenu',{name : result.rows[0]['name'],items:result3});
                });
                }
            }
        )
    }
}

exports.update_menu = function(req,res,next){
	
}