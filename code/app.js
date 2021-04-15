const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const login = require('./routes/login');
const signup = require('./routes/signup');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,'public')));


app.use('/login',login);
app.use('/signup',signup);

app.listen(3000);