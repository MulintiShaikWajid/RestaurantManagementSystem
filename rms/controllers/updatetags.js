const pool = require('../utils/database');
const Person = require('../models/person');
const Updatetags = require('../models/updatetags');

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
                	Updatetags.item_tags().then((result3)=>{
                        res.render('updatetags',{name : result.rows[0]['name'],item_tags:result3.rows});
                    });
                }
            }
        )
    }
}

exports.get_item = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
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
                    res.cookie('redirect',req.url,{signed:true});
                    res.redirect('/login');
                }
                else{
                    Updatetags.get_item_tag(req.params.id).then((result3)=>{
                        res.render('one_item_tag', {err:false, id: req.params.id, tagname: result3.rows[0]['type']});
                    })
                }
            })
        }
}

exports.new_item = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
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
                        res.cookie('redirect',req.url,{signed:true});
                        res.redirect('/login');
                    }
                    else{
                        res.render('new_item_tag',{err:false});
                    }
                })
    }
}

exports.update_item = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
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
                        res.cookie('redirect',req.url,{signed:true});
                        res.redirect('/login');
                    }
                    else{
                        Updatetags.checkforoldtag(req.body.tagname, req.params.id).then((result3)=>{
                            if(result3.rows[0]['tagcount'] > 0){
                                res.render('one_item_tag', {err:true, id: req.params.id,err_msg:"**Tag name already exists, enter a new one", tagname:req.body.tagname});  
                                return;
                            }
                            Updatetags.update_item_tag(req.params.id,req.body['tagname']).then(()=>{
                                        res.redirect('/updatetags');                                
                            })
                        })  
                    }
        })
    }
}

exports.delete_item = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
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
                        res.cookie('redirect',req.url,{signed:true});
                        res.redirect('/login');
                    }
                    else{
                        Updatetags.deletetag(req.body.id).then(()=>{
                            res.redirect('/updatetags'); 
                            return;
                        })
                    }
                })
        }
    }

exports.additem = function(req,res,next){
    if (! ("session_id" in req.signedCookies)){
        res.cookie('redirect',req.url,{signed:true});
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
                        res.cookie('redirect',req.url,{signed:true});
                        res.redirect('/login');
                    }
                    else{
                        Updatetags.checkfortag(req.body.tagname).then((result3)=>{
                            if(result3.rows[0]['tagcount'] > 0){
                                res.render('new_item_tag', {err:true, err_msg:"**Tag name already exists, enter a new one"});  
                                return;
                            }
                            Updatetags.get_newid().then((ans)=>{
                                Updatetags.new_item_tag(ans.rows[0]['new_id'],req.body['tagname']).then(()=>{
                                            res.redirect('/updatetags');                                
                                }) 
                            })
                        })
                    }
                })
        }
    }
