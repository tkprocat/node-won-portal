var express = require('express');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var computerDB = require('../../db/computers');

router.get('/api/computers/:name', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    computerDB.findByName(req.params.name, function (err, data) {
        if (err) {
            res.status(500).json({ status: 500, message: 'Error getting computer from database.' });
            return;
        }
        res.json(data);
    });
});

router.get('/api/computers/', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    computerDB.findAll(function (err, data) {
        if (err) {
            res.status(500).json({status: 500, message: 'Error getting computers from database.'});
            return;
        }
        res.json(data);
    });
});

//New
router.post('/api/computers', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('name', 'Name can only contain alphanumeric letters.').isAlphanumeric();
    req.checkBody('ip', 'Invalid IP.').isIP();
    req.checkBody('mac', 'Invalid MAC').isMACAddress();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(errors);
        return;
    }
    
    computerDB.findByName(req.body.name, function (err, data) {
        if (err) {
            res.status(400).json({ msg: 'Error checking for duplicate computer name.' });
            return;
        }
        if (data) {
            res.status(400).json([{ msg: 'Computer name already exists.' }]);
            return;
        }
        computerDB.createComputer(req.body.name, req.body.ip, req.body.mac, function (err, data) {
            if (err) {
                res.status(400).json({ msg: 'Error adding computer.' });
                return;
            }
            res.json({ msg: 'Computer added.' });
        });
    });
});

//Update
router.post('/api/computers/:id', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('name', 'Name can only contain alphanumeric letters.').isAlphanumeric();
    req.checkBody('ip', 'Invalid IP.').isIP();
    req.checkBody('mac', 'Invalid MAC').isMACAddress();
    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(errors);
        return;
    }

    computerDB.findById(req.body.id, function (err, computer) {
        if (err) {
            res.status(400).json({ msg: 'Computer not found.' });
        } else {
            computerDB.updateComputer(req.body.id, req.body.name, req.body.ip, req.body.mac, function (err, data) {
                if (err) {
                    res.status(400).json({ msg: 'Error updating computer.' });
                    return;
                }
                res.json({ msg: 'Computer updated.' });
            });
        }
    });
});

//Delete
router.delete('/api/computers/:id', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    req.checkBody('id' + '', 'Invalid computer.').notEmpty().isInt();
    req.sanitizeParams('id').toInt();
    var err = req.validationErrors();
    if (err) {
        res.status(404).json({ msg: 'Invalid id' });
        return;
    }
    
    computerDB.findById(req.params.id, function (err, computer) {
        if (err) {
            res.status(500).json({ msg: 'Error getting computers from database.' });
            return;
        } 
        computerDB.deleteComputer(req.body.id, function (err, data) {
            if (err) {
                res.status(500).json({ msg: 'Error deleting computers from database.' });
                return;
            }
            res.json({ msg: 'Computer deleted.' });
        });
    });
});

module.exports = router;