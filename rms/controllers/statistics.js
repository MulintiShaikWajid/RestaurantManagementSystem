const pool = require('../utils/database');
const Person = require('../models/person');
const Statistics = require('../models/statistics');

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
                //     Statistics.get_items_avgtime().then((result3)=>{
                //         Statistics.get_day_customer_num().then((result4)=>{
                //             Statistics.get_slot_customer_num().then((result5)=>{
                //                 // Statistics.get_pop_dish().then((result6)=>{
                //         res.render('statistics',{a: result3.rows,b: result4.rows,c: result5.rows});
                //     })})})
                // // })
                var tests = [[0, 0],[1, 10],[2, 23],[3, 17],[4, 18]];
                res.render('statistics', {
                    tests: JSON.stringify(tests)
                });

                }
            }
        )
    }
} 
