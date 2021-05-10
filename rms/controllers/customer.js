const Person = require('../models/customer_person');
const Item = require('../models/item')
const Customer = require('../models/customer')
const { body, validationResult, Result } = require('express-validator');
const crypto = require('crypto');
exports.hello = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    res.render('customer_hello',{name : result.rows[0]['name']});
                }
            }
        )
    }
}

exports.get_menu = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Item.get_all_items().then(
                        (result)=>{
                            temp = ""
                            for(i=0;i<result.rows.length;i++){
                                temp = temp + ","+result.rows[i]['tags'];
                            }
                            all_tags = temp.split(",")
                            ans = []
                            for(i=0;i<all_tags.length;i++){
                                if(ans.indexOf(all_tags[i])===-1&&all_tags[i]!==''){
                                    ans.push(all_tags[i]);
                                }
                            }
                            res.render('menu',{items:result.rows,all_tags:ans});
                        }
                    )
                }
            }
        )
    }
}

exports.show_item_get = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Item.one_detail(req.params.id,result.rows[0]['id']).then(
                        (result) => {
                            if(result.rowCount===0){
                                res.render('error',{message:"Sorry, the url is invalid"});
                            }
                            else{
                                tags = []
                                ingredients = []
                                for(var i=0;i<result.rowCount;i++){
                                    val = result.rows[i];
                                    if(tags.indexOf(val['type'])===-1){
                                        tags.push(val['type']);
                                    }
                                    if(ingredients.indexOf(val['ingredient'])===-1){
                                        ingredients.push(val['ingredient']);
                                    }
                                }
                                quantity = result.rows[0]['quantity']
                                Item.get_reviews(req.params.id).then(
                                    (myresult) => {
                                        // console.log(myresult.rows)
                                        res.render('one_detail',{name:result.rows[0]['name'],price:result.rows[0]['price'],tags:tags.join(),ingredients:ingredients.join(),quantity:quantity,reviews:myresult.rows});
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    }
}

exports.show_item_post = 
    (req,res,next) => {
        if (! ("session_id" in req.signedCookies)){
            res.cookie('redirect',req.url,{signed:true});
            res.redirect('/login');
            return;
        }
        else{
            Person.get_details_from_session_id(req.signedCookies['session_id']).then(
                (result)=>{
                    if(result.rowCount===0){
                        res.cookie('redirect',req.url,{signed:true});
                        res.redirect('/login');
                    }
                    else{
                        if(!req.body.new_quantity||req.body.new_quantity<0){
                            res.redirect("/customer/error/1");
                        }
                        Item.update_quantity_of_item(result.rows[0]['id'],req.params.id.toString(),req.body.new_quantity).then(
                            (result) => {
                                res.redirect(req.headers.referer);
                            }
                        )
                    }
                }
            )
        }
    }

exports.show_cart_get = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.get_cart(result.rows[0]['id']).then(
                        (result) => {
                            total_price = 0;
                            for(i=0;i<result.rows.length;i++){
                                total_price+=result.rows[i]['quantity']*result.rows[i]['price'];
                            }
                            res.render('cart',{details:result.rows,total_price:total_price,});
                        }
                    )   
                }
            }
        )
    }
}


exports.show_cart_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.is_cart_empty(result.rows[0]['id']).then(
                        (result1)=>{
                            if(result1.rowCount===0){
                                res.statusMessage = "Cart should not be empty";
                                res.redirect('/customer/cart');
                            }
                            else{ 
                                Customer.check_table_availability(result.rows[0]['id'],parseInt(req.body.tableno),parseInt((new Date).getHours()),(new Date).toLocaleString().split(',')[0].split('/').reverse().join('-')).then(
                                    (result2)=>{
                                        // console.log((new Date).getHours(),new Date().toISOString().slice(0, 10))
                                        if(result2.rowCount===0){
                                            // console.log("Hello")
                                            res.redirect('/customer/error/2');
                                        }
                                        else{
                                            Customer.place_order(result.rows[0]['id'],parseInt(req.body.tableno)).then(
                                                (result4) => {
                                                    res.redirect('/customer/prevcart');
                                                }
                                            ).catch(
                                                err => {
                                                    res.render('error',{message:"Ingredients not sufficient to prepare items"})
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    }
}

exports.show_previous_orders = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.get_previous_orders(result.rows[0]['id']).then(
                        (result1) => {
                            allow = true;
                            if(result1.rows[0])
                            res.render('prevcart',{items : result1.rows});
                        }
                    )   
                }
            }
        )
    }   
}


exports.show_order = (req,res,next)  => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.is_order_valid(result.rows[0]['id'],parseInt(req.params.id)).then(
                        (result1) => {
                            if(result1.rowCount===0){
                                res.render('show_order',{message:"Sorry this order does not belong to you or it does not exist"});
                            }
                            else{
                                Customer.get_order_details(parseInt(req.params.id)).then(
                                    (result2) => {
                                        total_price = 0;
                                        for(i=0;i<result2.rows.length;i++){
                                            total_price+=parseInt(result2.rows[i]['price']);
                                        }
                                        allow = "";
                                        if(result2.rows[0]['status']==='order-completed'){
                                            allow = "a";
                                        }
                                        res.render('show_order',{message:"",items:result2.rows,orderid:req.params.id,total_price:total_price,status:result2.rows[0]['status'],allow:allow});
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    }   
}

exports.rate_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.check_valid_order_id_item_id(parseInt(req.params.itemid),parseInt(req.params.orderid),result.rows[0]['id']).then(
                        (result1) => {
                            if(result1.rowCount===0){
                                res.redirect('/customer/hello');
                            }
                            else{
                                Customer.rate(parseInt(req.params.itemid),parseInt(req.params.orderid),parseInt(req.body.rating)).then(
                                    (result2) => {
                                        res.redirect(req.headers.referer);
                                    }
                                )
                            }
                        }
                    )  
                }
            }
        )
    }    
}

exports.review_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.check_valid_order_id_item_id(parseInt(req.params.itemid),parseInt(req.params.orderid),result.rows[0]['id']).then(
                        (result1) => {
                            if(result1.rowCount===0){
                                res.redirect('/customer/hello');
                            }
                            else{
                                Customer.review(parseInt(req.params.itemid),parseInt(req.params.orderid),req.body.review).then(
                                    (result2) => {
                                        res.redirect(req.headers.referer);
                                    }
                                )
                            }
                        }
                    )  
                }
            }
        )
    }    
}

exports.show_notifications = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.get_notifications(result.rows[0]['id']).then(
                        (result1) => {
                            res.render('notifications',{notifications : result1.rows});
                        }
                    )   
                }
            }
        )
    }   
}

exports.book_table_get = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.get_total_tables().then(
                        (result1) => {
                            Customer.get_table_details().then(
                                (result2) => {
                                    res.render('book',{total_tables:result1.rowCount-1,details:result2.rows});
                                }
                            )
                        }
                    )
                }
            }
        )
    }  
}

exports.book_table_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                    return;
                }
                else{
                    date = req.body.year.toString()+'-'+req.body.month.toString()+'-'+req.body.day.toString();
                    temp = new Date(req.body.year,req.body.month-1,req.body.day,req.body.hour,0);
                    console.log(temp);
                    console.log(req.body.year,req.body.month,req.body.day,req.body.hour);
                    flag = false;
                    given_year = parseInt(req.body.year);
                    given_month = parseInt(req.body.month);
                    given_day = parseInt(req.body.day);
                    given_hour = parseInt(req.body.hour);
                    mytemp = new Date();
                    pre_year = mytemp.getYear()+1900;
                    pre_month = mytemp.getMonth()+1;
                    pre_day = mytemp.getDate();
                    pre_hour = mytemp.getHours();
                    console.log(given_year,given_month,given_day,given_hour);
                    console.log(pre_year,pre_month,pre_day,pre_hour);
                    if(given_year>pre_year){
                        flag=true;
                    }
                    else{
                        if(given_year===pre_year){
                            if(given_month>pre_month){
                                flag=true;
                            }
                            else{
                                if(given_month===pre_month){
                                    if(given_day>pre_day){
                                        flag=true;
                                    }
                                    else{
                                        if(given_day===pre_day){
                                            if(given_hour>=pre_hour){
                                                flag=true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if(!flag){
                        Customer.get_total_tables().then(
                            (result) => {
                                console.log("Goku")
                                res.render('error',{total_tables:result.rowCount-1,message:"past slot can not be selected"});
                                console.log("Bulma");
                                return;
                            }
                        )
                    }
                    else{
                        [y,m,d] = date.split('-')
                        py=new Date().getYear()+1900;
                        pm=new Date().getMonth()+1;
                        pd=new Date().getDate();
                        ph=new Date().getHours();
                        Customer.already_booked(result.rows[0]['id'],parseInt(req.body.tableno),date,parseInt(req.body.hour),y,m,d,py,pm,pd,ph).then(
                            (result1) => {
                                if(result1.rowCount!==0){
                                    res.render('error',{message:"The slot was already booked"});
                                    return;
                                }
                                else{
                                    Customer.insert_table_request(result.rows[0]['id'],parseInt(req.body.tableno),date,parseInt(req.body.hour)).then(
                                        (result2) => {
                                            res.redirect('/customer/prevtable');
                                            return;
                                        }
                                    )
                                }
                            }
                        )
                    }
                }
            }
        )
    }
}




exports.show_error_get = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    if(parseInt(req.params.code)===1){
                        res.render("error",{message:"New quantity can not be negative and it should not be empty"});
                        return;
                    }
                    if(parseInt(req.params.code)===2){
                        res.render("error",{message:"Either you dont have a table booking or the table number is not valid"});
                        return;
                    }
                }
            }
        )
    }
}

exports.show_prevtable_get = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.get_prevtable(result.rows[0]['id']).then(
                        (result1) => {
                            res.render('prevtable',{details:result1.rows});
                        }
                    )
                }
            }
        )
    }
}


exports.logout = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.logout(result.rows[0]['id']).then(
                        (result1)=>{
                            res.redirect('/login');
                        }
                    )
                }
            }
        )
    }
}


exports.create_get = (req,res,next) => {
    res.render('create',{username:"",password:"",name:"",hno:"",street:"",city:"",state:"",country:"",pin:"",phone:"",message:""});
}

exports.create_post = (req,res,next) => {
    username = req.body.username.toString();
    password = req.body.password.toString();
    hno = req.body.hno.toString();
    myname = req.body.name.toString();
    street = req.body.street.toString();
    city = req.body.city.toString();
    state = req.body.state.toString();
    country = req.body.country.toString();
    pin = req.body.pin.toString();
    phone = req.body.phone.toString();
    if(username.length<1){
        res.render('create',{username:username,password:password,name:myname,hno:hno,street:street,city:city,state:state,country:country,pin:pin,phone:phone,message:"Username should not be empty"});
        return;
    }
    Customer.check_username(username).then(
        (result) => {
            if(result.rowCount>0){
                res.render('create',{username:username,password:password,name:myname,hno:hno,street:street,city:city,state:state,country:country,pin:pin,phone:phone,message:"Username is already taken"});
                return;
            }
            Customer.check_phone(phone).then(
                (result4) => {
                    if(result4.rowCount>0){
                        res.render('create',{username:username,password:password,name:myname,hno:hno,street:street,city:city,state:state,country:country,pin:pin,phone:"",message:"Phone number is already used"});
                        return; 
                    }
                    password = crypto.createHash('sha256').update(req.body.password+'squirrel').digest('hex');
                    Customer.create(username,password,myname,hno,street,city,state,country,pin).then(
                        (result) => {
                            Customer.get_id(username).then(
                                (result1) => {
                                    Customer.insert_phone(result1.rows[0]['id'],phone).then(
                                        (result2) => {
                                            res.redirect('/login');
                                            return;
                                        }
                                    )
                                }
                            )
                        }
                    )
                } 
            )
            
        }
    )

}



exports.edit_get = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.personal_details(result.rows[0]['id']).then(
                        (result1) => {
                            Customer.phone_numbers(result.rows[0]['id']).then(
                                (result2) => {
                                    res.render('customer_edit',{details:result1.rows[0],phone_numbers:result2.rows});
                                }
                            )
                        }
                    )
                }
            }
        )
    }
}


exports.name_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.update_name(result.rows[0]['id'],req.body.name).then(
                        (result1) => {
                            res.redirect('/customer/edit')
                        }
                    )
                }
            }
        )
    }
}

exports.username_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.check_username(req.body.username).then(
                        (result1) => {
                            if(result1.rowCount>0){
                                res.render('error',{message:"Username already used"});
                            }
                            else{
                                Customer.update_username(result.rows[0]['id'],req.body.username).then(
                                    (result2) => {
                                        res.redirect('/customer/edit');
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    }
}


exports.password_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    password = crypto.createHash('sha256').update(req.body.password+'squirrel').digest('hex');
                    Customer.update_password(result.rows[0]['id'],password).then(
                        (result1) => {
                            res.redirect('/customer/logout')
                        }
                    )
                }
            }
        )
    }
}

exports.street_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.update_street(result.rows[0]['id'],req.body.street).then(
                        (result1) => {
                            res.redirect('/customer/edit')
                        }
                    )
                }
            }
        )
    }
}

exports.hno_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.update_hno(result.rows[0]['id'],req.body.hno).then(
                        (result1) => {
                            res.redirect('/customer/edit')
                        }
                    )
                }
            }
        )
    }
}

exports.city_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.update_city(result.rows[0]['id'],req.body.city).then(
                        (result1) => {
                            res.redirect('/customer/edit')
                        }
                    )
                }
            }
        )
    }
}

exports.state_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.update_state(result.rows[0]['id'],req.body.state).then(
                        (result1) => {
                            res.redirect('/customer/edit')
                        }
                    )
                }
            }
        )
    }
}

exports.country_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.update_country(result.rows[0]['id'],req.body.country).then(
                        (result1) => {
                            res.redirect('/customer/edit')
                        }
                    )
                }
            }
        )
    }
}

exports.pin_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.update_pin(result.rows[0]['id'],req.body.pin).then(
                        (result1) => {
                            res.redirect('/customer/edit')
                        }
                    )
                }
            }
        )
    }
}

exports.phone_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.update_phone(result.rows[0]['id'],req.params.number).then(
                        (result1) => {
                            console.log("WHO")
                            res.redirect('/customer/edit')
                        }
                    )
                }
            }
        )
    }
}

exports.add_phone_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    console.log("WHERE");
                    Customer.check_phone(req.body.phone).then(
                        (result1) => {
                            if(result1.rowCount>0){
                                res.render('error',{message:"Phone number already used"});
                            }
                            else{
                                Customer.add_phone(result.rows[0]['id'],req.body.phone).then(
                                    (result2) => {
                                        res.redirect('/customer/edit');
                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    }
}


exports.rcoins_post = (req,res,next) => {
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
        res.redirect('/login');
        return;
    }
    else{
        Person.get_details_from_session_id(req.signedCookies['session_id']).then(
            (result)=>{
                if(result.rowCount===0){
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Customer.get_rcoins_used(result.rows[0]['id'],req.params.order_id).then(
                        (result2) => {
                            myrocins = parseInt(req.body.rcoins)-parseInt(result2.rows[0]['rcoins_used'])
                            Customer.update_amount_paid(result.rows[0]['id'],req.params.order_id,myrcoins).then(
                                (result1) => {
                                    res.redirect('/customer/prevcart');
                                }
                            ).catch(
                                (error1) => {
                                    res.render('error',{message:"Either you do not have sufficient rcoins are you are paying more rcoins than needed"});
                                }
                            )
                        }
                    )
                    Customer.update_amount_paid(result.rows[0]['id'],req.params.order_id,req.body.rcoins).then(
                        (result1) => {
                            res.redirect('/customer/prevcart');
                        }
                    ).catch(
                        (error1) => {
                            res.render('error',{message:"Either you do not have sufficient rcoins are you are paying more rcoins than needed"});
                        }
                    )
                }
            }
        )
    }
}