"use strict";
var express = require('express');
var router = express.Router();
var passport = require('passport');
var machines = require('../db/machines');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    machines.findAll(function (err, machines) {
        if (err) {
            console.err('Error getting list of machines from DB.');
            return;
        }
        res.render('index', { machines: machines});
    });
});

module.exports = router;
