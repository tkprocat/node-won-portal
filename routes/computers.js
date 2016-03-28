var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/computers/', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    res.render('computers');
});

module.exports = router;