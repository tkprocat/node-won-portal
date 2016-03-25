var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('./auth/passport');
var db = require('./db');
var computers = require('./routes/computers');
var index = require('./routes/index');
var login = require('./routes/login');
var ping = require('./routes/ping');
var users = require('./routes/users');
var won = require('./routes/won');
var api_computers = require('./routes/api/computers');
var api_ping = require('./routes/api/ping');
var api_users = require('./routes/api/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        return {
            param: param,
            msg: msg,
        };
    }
}));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
    secret: 'random secret string',
    resave: false,
    saveUninitialized: false,
    secure: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(computers);
app.use(index);
app.use(login);
app.use(ping);
app.use(users);
app.use(won);
app.use(api_computers);
app.use(api_ping);
app.use(api_users);

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

module.exports = app;
