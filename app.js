var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.js');
var wol = require('wake_on_lan');
var ip = require('ip');
var crypto = require('crypto');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var login = require('./routes/login');
var ping = require('ping');

passport.use(new Strategy(
    function (username, password, cb) {
        db.users.findByUsername(username, function (err, user) {
            if (err)
                return cb(err);
            if (!user)
                return cb(null, false);
            if (user.password !== crypto.createHash('sha256').update(password).digest('hex'))
                return cb(null, false);
            return cb(null, user);
        });
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    db.users.findById(id, function (err, user) {
        if (err)
            return cb(err);
        cb(null, user);
    });
});


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

app.get('/', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    res.render('index', { machines: config.machines });
});

app.get('/login', function (req, res, next) {
    res.render('login');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
    res.redirect('/');
});

app.post('/won', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    var mac = req.body.mac.trim();
    
    var result = config.machines.filter(function(machine){
        return machine.mac = mac;
    });
    
    if (result.length > 0) {
        wol.wake(result[0].mac, { address: ip.or(result[0].ip, '0.0.0.255') });
        console.log('Magic packet sent to: ' + result[0].mac + '(' + ip.or(result[0].ip, '0.0.0.255') +')');
    }
    res.redirect('/ping/'+ result[0].ip);
});

app.get('/ping/:host', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    res.render('ping', {host: req.params.host});
});

app.post('/ping', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    ping.promise.probe(req.body.host).then(function (result) {
        if (result.alive)
            res.json({ message: 'Computer has started!', alive: true });
        else 
            res.json({ message: 'Computer is booting or not powered on.', alive: false });        
    });
});

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
