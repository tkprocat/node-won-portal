var express = require('express');
var router = express.Router();
var computers = require('../db/computers');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    computers.findAll(function (err, computers) {
        if (err) {
            console.err('Error getting list of computers from DB.');
            return;
        }
        res.render('index', { computers: computers});
    });
});

module.exports = router;
