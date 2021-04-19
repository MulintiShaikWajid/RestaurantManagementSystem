const Person = require('../models/person');
const Item = require('../models/item')
const { body, validationResult, Result } = require('express-validator');
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
                                res.render('one_detail',{message:"Sorry, the url is invalid"});
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
                                console.log(quantity);
                                res.render('one_detail',{name:result.rows[0]['name'],price:result.rows[0]['price'],tags:tags.join(),ingredients:ingredients.join(),quantity:quantity,message:""});
                            }
                        }
                    )
                }
            }
        )
    }
}

exports.show_item_post = [
    body('new_quantity', 'New quantity should not be empty').trim().isLength({ min: 1 }).escape(),
    (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.redirect('menu/'+req.params.id.toString());
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
                        Item.update_quantity_of_item(result.rows[0]['id'],req.params.id.toString(),req.body.new_quantity).then(
                            (result) => {
                                res.redirect(req.params.id.toString());
                            }
                        )
                    }
                }
            )
        }
    }
]