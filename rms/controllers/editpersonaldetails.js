const pool = require('../utils/database');
const Person = require('../models/person');
const Editpersonaldetails = require('../models/editpersonaldetails');
const crypto = require('crypto');

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
                        if(!(result2.rows[0]['role_name']=='head-waiter' || result2.rows[0]['role_name']=='cashier' || result2.rows[0]['role_name']=='manager')){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    Editpersonaldetails.get_personal_details(req.body.id).then((result3)=>{
                        Editpersonaldetails.get_phone_numbers(req.body.id).then((result4)=>{
                            Editpersonaldetails.get_timeslots(req.body.id).then((result5)=>{
                                var list_of_phone_numbers = "";
                                for(row in result4.rows){
                                    list_of_phone_numbers = list_of_phone_numbers.concat(result4.rows[row]['phone_number']);
                                    list_of_phone_numbers = list_of_phone_numbers.concat(", ");
                                }
                                if(!(list_of_phone_numbers == "")){
                                    list_of_phone_numbers = list_of_phone_numbers.substring(0, list_of_phone_numbers.length-2);
                                }
                                res.render('editpersonaldetails',{err: false, err_msg:"",role : req.body.role, name : result.rows[0]['name'], id:result.rows[0]['id'], 
                                pd: result3.rows[0], phone_numbers: list_of_phone_numbers, time_slots:result5.rows[0]['time_slots']}); // pd is personal_details
                            })
                        })
                    })
                }
            }
        )
    }
}

exports.update_details = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                Person.role(result.rows[0]['id']).then(
                    (result2)=>{
                        if(!(result2.rows[0]['role_name']=='head-waiter' || result2.rows[0]['role_name']=='cashier')){
                            res.redirect('/error');
                        }
                    })
                if(result.rowCount===0){
                    res.redirect('/login');
                }
                else{
                    var list_of_ph_no = (req.body.phone_no).split(",");
                    var ph_nos = [];
                    var re = new RegExp("^[+]?[0-9 ]+$");
                    for(var i = 0; i < list_of_ph_no.length; i++){
                        var ph_no = list_of_ph_no[i].trim();
                        if(re.test(ph_no)){
                            ph_nos.push(ph_no);
                        }else{
                            res.render('editpersonaldetails', {err: true, err_msg:"**The phone numbers textbox should \
                            have comma separated values of {^[+]?[0-9 ]+$}. Eg: '+91 1234567890, +1 123 4567890'", name: req.body.full_name, phone_numbers: req.body.phone_no,
                            id:req.body.id, role: req.body.role, pd:{password: req.body.hidden_password, address_house_no:
                            req.body.house_no, address_street: req.body.street, address_city: req.body.city, address_state: 
                            req.body.state, address_country: req.body.country, address_pin_code: req.body.pin} });
                            return;
                        }
                    }

                    // if(req.body.name == ""){
                    //     res.render('editpersonaldetails', {err: true, err_msg:"**Your name can't be empty", name: req.body.full_name, phone_numbers: req.body.phone_no,
                    //     id:req.body.id, role: req.body.role, pd:{password: req.body.hidden_password, address_house_no:
                    //     req.body.house_no, address_street: req.body.street, address_city: req.body.city, address_state: 
                    //     req.body.state, address_country: req.body.country, address_pin_code: req.body.pin} });
                    //     return; 
                    // }

                    var hashed_password = "";
                    if(req.body.password == ""){
                        hashed_password = req.body.hidden_password;
                    }else{
                        hashed_password = crypto.createHash('sha256').update(req.body.password+'squirrel').digest('hex');
                    }

                    Editpersonaldetails.edit_details(req.body.id, req.body.full_name, req.body.house_no, req.body.street,
                        req.body.city, req.body.state, req.body.country, req.body.pin, hashed_password
                    ).then(()=>{
                        Editpersonaldetails.delete_phone_numbers(req.body.id).then(()=>{
                            Editpersonaldetails.add_phone_numbers(req.body.id, ph_nos).then(()=>{
                                if(req.body.role == 'head-waiter'){
                                    res.redirect('/headwaiterhello');
                                }else if(req.body.role == 'cashier'){
                                    res.redirect('/cashierhello');
                                }else if(req.body.role == 'manager'){
                                    res.redirect('/managerhello');
                                }
                            })     
                        })
                    })
                }
            }
        )
    }
}

