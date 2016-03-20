"use strict";
var db = require('./db.js');

exports.findByUsername = function (username, callback) {
    process.nextTick(function () {
        db.get('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
            db.serialize(function () {
                if (err) {
                    return callback(err, null);
                }
                
                return callback(null, row);
            });
        });
    });
};

exports.findById = function (id, callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.get('SELECT * FROM users WHERE ID = ?', [id], function (err, row) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, row);
            });
        });
    });
};

exports.createUser = function (username, password, callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.run("INSERT INTO users VALUES (?, ?, ?)", [null, username, require('crypto')().createHash('sha256').update(password).digest('hex')], function (err, data) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, data);
            });
        });
    });
};