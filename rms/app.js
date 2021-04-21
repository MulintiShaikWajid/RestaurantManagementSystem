var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var loginRouter = require('./routes/login');
var helloRouter = require('./routes/hello');

var managerhello = require('./routes/managerhello')

var updatemenu = require('./routes/updatemenu')
var updateinventory = require('./routes/updateinventory')
var updatestaff = require('./routes/updatestaff')
var currentorders = require('./routes/currentorders')
var updatedetails = require('./routes/updatedetails')
var statistics = require('./routes/statistics')
var notifications = require('./routes/notifications')
var customerRouter =  require('./routes/customer');

var cashierhello = require('./routes/cashierhello');
var headwaiterhello = require('./routes/headwaiterhello');
var editpersonaldetails = require('./routes/editpersonaldetails');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/customer',express.static(path.join(__dirname, 'public')));
app.use('/customer/menu',express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login',loginRouter);
app.use('/hello',helloRouter);

app.use('/managerhello',managerhello);
app.use('/updatemenu',updatemenu)
app.use('/updateinventory',updateinventory)
app.use('/updatestaff',updatestaff)
app.use('/currentorders',currentorders)
app.use('/updatedetails',updatedetails)
app.use('/statistics',statistics)
app.use('/notifications',notifications)
app.use('/customer',customerRouter);

app.use('/cashierhello', cashierhello);
app.use('/headwaiterhello', headwaiterhello);
app.use('/editpersonaldetails', editpersonaldetails);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
