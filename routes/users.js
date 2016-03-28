var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/users/', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    res.render('users');
});

module.exports = router;