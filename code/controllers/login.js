const Login = require('../models/login');


exports.get_page = (req,res,next) => {
    res.render('login', {
        pageTitle: 'Login Page',
        path: '/login',
        editing: false
    });
};

exports.post_login = (req,res,next) => {
    const username = req.body.username;
    const hash_pass = req.body.password;
    const login = new Login( username,hash_pass);
    login
        .check_login()
        .then(() => {
            res.redirect('/home');
        })
        .catch(err => console.log(err));
};