'use strict';
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var wol = require('wake_on_lan');
var ip = require('ip');
var passport = require('./auth/passport');
var db = require('./db');
var login = require('./routes/login');
var index = require('./routes/index');
var ping = require('ping');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

app.use(index);
app.use(login);

//app.get('/', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
//    db.machines.findAll(function (err, machines) {
//        if (err) {
//            console.err('Error getting list of machines from DB.');
//            return;
//        }
//        console.log(machines);
//        res.render('index', { machines: machines});
//    });
//});



//app.post('/won', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
//    var mac = req.body.mac.trim();
//    db.machines.findAll(function (err, machines) {
//        var result;
//        if (err) {
//            console.err('Error getting list of machines from DB.');
//            return;
//        }
//        result = machines.filter(function (machine) {
//            return machine.mac === mac;
//        });
        
//        if (result.length > 0) {
//            wol.wake(result[0].mac, { address: ip.or(result[0].ip, '0.0.0.255') });
//            console.log('Magic packet sent to: ' + result[0].mac + '(' + ip.or(result[0].ip, '0.0.0.255') + ')');
//        }
//        res.redirect('/ping/' + result[0].ip);
//    });
//});

//app.get('/ping/:host', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
//    res.render('ping', { host: req.params.host });
//});

//app.post('/ping', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
//    ping.promise.probe(req.body.host).then(function (result) {
//        if (result.alive) {
//            res.json({ message: 'Computer has started!', alive: true });
//        } else {
//            res.json({ message: 'Computer is booting or not powered on.', alive: false });
//        }
//    });
//});

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
