const pool = require('../utils/database');
const Person = require('../models/person');
exports.hello_get = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    res.render('managerhello',{name : result.rows[0]['name']});
                }
            }
        )
    }
}
