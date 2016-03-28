var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var ping = require('ping');

router.post('/api/ping', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
  
    var match = req.body.ip.match('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0 - 5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
    if (match.length !== 1) {
        res.json({ message: 'Invalid IP.', alive: false, status: 'error' });
        next();
    }

    ping.promise.probe(req.body.ip).then(function (result) {
        if (result.alive) {
            res.json({ message: 'Computer has started!', alive: true });
        } else {
            res.json({ message: 'Computer is booting or not powered on.', alive: false });
        }
    });
});
module.exports = router;