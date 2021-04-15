const Signup = require('../models/signup');


exports.get_page = (req,res,next) => {

    res.render('signup', {
        pageTitle: 'Signup Page',
        path: '/signup',
        editing: false
    });
};

exports.add_user = (req,res,next) => {
    const username = req.body.username;
    const pass = req.body.password;
    const conf_pass = req.body
    const login = new Login( username,hash_pass);
    login
        .check_login()
        .then(() => {
            res.redirect('/home');
        })
        .catch(err => console.log(err));
};