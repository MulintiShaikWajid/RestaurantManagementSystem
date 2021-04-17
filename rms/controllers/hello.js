const pool = require('../utils/database');
exports.hello_get = function(req,res,next){
    if (! ("session" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    console.log("ROSHI")
    session_id = req.signedCookies['session'];
    console.log(session_id);
    pool.query('select name from person where session_id = $1',[session_id]).then((result)=>{
        console.log(result.rowCount);
        res.render('hello',{name:result.rows[0]['name']});
    })
}