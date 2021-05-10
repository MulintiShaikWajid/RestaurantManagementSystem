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
                    Statistics.get_items_avgtime().then((result3)=>{
                        Statistics.get_no_of_items().then((res_count)=>{
                            items = [];
                            a = [];//avg_times
                            var i=0;
                            var j = res_count.rows[0]['count'];
                            console.log(j);
                            for(var i=0;i<j;i++){
                                items.push("'"+result3.rows[i]['name']+"'");
                                a.push(result3.rows[i]['average_time']);
                            }
                            Statistics.get_day_customer_num().then((result4)=>{
                                b=[];
                                var days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                                for(var i=0;i<7;i++){
                                    for(var j=0;j<7;j++){
                                        if(days[i]===result4.rows[j]['day']){
                                            b.push(result4.rows[j]['count']);
                                        }
                                    }
                                }
                                Statistics.get_slot_customer_num().then((result5)=>{
                                    c=[];
                                    var slots=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
                                    for(var i=0;i<23;i++){
                                        for(var j=0;j<23;j++){
                                            if(slots[i]===result5.rows[j]['slot_no']){
                                                c.push(result5.rows[j]['count']);
                                            }
                                        }
                                    }
                                    Statistics.get_pop_dish().then((result6)=>{
                                        res.render('statistics',{a: a,items:items,b: b,c: c,slots:slots,d:result6.rows});
                                    })
                                })
                            })
                        })
                    })
                }
            }
        )
    }
} 
