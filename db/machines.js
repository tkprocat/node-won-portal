"use strict";
var db = require('./db.js');

exports.findAll = function (callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.all('SELECT * FROM machines', [], function (err, rows) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
            });
        });
    });
};

exports.findByName = function (name, callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.get('SELECT * FROM machines WHERE name = ?', [name], function (err, row) {
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
            db.get('SELECT * FROM machines WHERE ID = ?', [id], function (err, row) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, row);
            });
        });
    });
};

exports.createMachine = function (name, ip, mac) {
    process.nextTick(function () {
        db.serialize(function () {
            db.run("INSERT INTO machines VALUES (?, ?, ?)", [null, name, ip, mac]);
        });
    });
};

exports.deleteMachine = function (id, callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.run("DELETE FROM machines WHERE id = ?", [id], function (err, data) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, data);
            });
                });
    });
};

exports.updateMachine = function (id, name, ip, mac, callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.run("UPDATE machines SET name = $name, WHERE id = $id", { $id: id, $name: name, $ip: ip, $mac: mac }, function (err, data) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, data);
            });
        });
    });
};