var express = require('express');
var app = express();
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
// var validator = require('express-validator');
var MongoStore = require('connect-mongo');
var moment = require('moment');
var routes = require('./routes/index');
var userRoutes = require('./routes/user');
const schedule = require('node-schedule');



mongoose.connect('mongodb+srv://root:buonwadiA1@cluster0.0sjynnm.mongodb.net/?retryWrites=true&w=majority');
require('./config/passport');

// view engine setup
// app.engine('handlebars', expressHbs());
// app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, 'views'));
const hbs = expressHbs.create({ defaultLayout: 'main', extname: '.hbs' });
app.engine('hbs', hbs.engine);

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://root:buonwadiA1@cluster0.0sjynnm.mongodb.net/?retryWrites=true&w=majority' }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/user', userRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000)
// module.exports = app;
