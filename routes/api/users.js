var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var userDB = require('../../db/users');
var util = require('util');

//Get user
router.get('/api/users/:username', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    userDB.findByUsername(req.params.username, function (err, data) {
        if (err) {
            res.status(500).json({ status: 500, message: 'Error getting user from database.' });
            return;
        }
        res.json(data);
    });
});

//Get all users
router.get('/api/users/', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    userDB.findAll(function (err, data) {
        if (err) {
            res.status(500).json({ status: 500, message: 'Error getting users from database.' });
            return;
        }
        data = data.map(function (user) {
            return { id: user.id, username: user.username }
        });
        res.json(data);
    });
});

//New user
router.post('/api/users', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    //Check that passwords match
    req.checkBody('username', 'Username is required.').notEmpty();
    req.checkBody('username', 'Username can only contain alphanumeric letters.').isAlphanumeric();
    req.checkBody('password', 'Password must be between 8 and 65 characters long.').len(8, 65);
    req.assert('confirm_password', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(errors);
        return;
    }

    //Check if a user with that username already exists.
    userDB.findByUsername(req.body.username, function (err, data) {
        if (err) {
            res.status(400).json({ msg: 'Error checking for duplicate username.' });
            return;
        }
        if (data) {
            res.status(400).json([{ msg: 'Username already exists.' }]);
            return;
        }

        userDB.createUser(req.body.username, req.body.password, function (err, data) {
            if (err) {
                res.status(400).json({ msg: 'Error creating user.' });
                return;
            }
            res.json({ msg: 'User created.' });
        });
    });
});

//Update user
router.post('/api/users/:id', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    //Check that passwords match
    req.checkBody('id' + '', 'Invalid user id.').notEmpty().isInt();
    req.checkBody('password', 'Password must be between 8 and 65 characters long.').len(8, 65);
    req.assert('confirm_password', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(errors);
        return;
    }

    userDB.findById(req.body.id, function (err, user) {
        if (err) {
            res.status(400).json([{ msg: 'User not found.' }]);
        } else {
            userDB.updateUser(req.params.id, req.body.password, function () {
                res.json([{ msg: 'User updated.' }]);
            });
        }
    });
});


//Delete user
router.delete('/api/users/', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    req.checkBody('id' + '', 'Invalid user.').notEmpty().isInt();
    req.sanitizeParams('id').toInt();
    var err = req.validationErrors();
    if (err) {
        res.status(404).json({ status: 404, message: 'Error getting users from database.' });
        return;
    }
    
    userDB.findById(req.body.id, function (err, data) {
        if (err) {
            res.status(404).json({ status: 404, message: 'Error getting users from database.' });
            return;
        }        
        userDB.deleteUser(req.body.id, function (err) {
            if (err) {
                res.status(500).json({ status: 500, message: 'Error deleting user from database.' });
                return;
            }
            res.json({ message: 'User deleted.' });
        });
        
    });
});

module.exports = router;