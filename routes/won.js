var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var computers = require('../db/computers')
var wol = require('wake_on_lan');
var ip = require('ip');

router.post('/won', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    var mac = req.body.mac.trim();
    computers.findAll(function (err, computers) {
        var result;
        if (err) {
            console.err('Error getting list of computers from DB.');
            return;
        }
        result = computers.filter(function (computer) {
            return computer.mac === mac;
        });
        
        if (result.length > 0) {
            wol.wake(result[0].mac, { address: ip.or(result[0].ip, '0.0.0.255') });
            console.log('Magic packet sent to: ' + result[0].mac + '(' + ip.or(result[0].ip, '0.0.0.255') + ')');
        }
        res.redirect('/ping/' + result[0].ip);
    });
});

module.exports = router;
