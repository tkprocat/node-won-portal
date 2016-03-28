var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/ping/:host', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    res.render('ping', { host: req.params.host });
});

module.exports = router;