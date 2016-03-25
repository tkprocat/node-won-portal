var db = require('./db.js');
var crypto = require('crypto');

exports.findAll = function (callback) {
    process.nextTick(function () {
        db.all('SELECT * FROM users', [], function (err, rows) {
            db.serialize(function () {
                if (err) {
                    return callback(err, null);
                }
                
                return callback(null, rows);
            });
        });
    });
};

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
            db.run('INSERT INTO users VALUES (?, ?, ?)', [null, username, crypto.createHash('sha256').update(password).digest('hex')], function (err, data) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, data);
            });
        });
    });
};

exports.updateUser = function (id, password, callback) {
    process.nextTick(function () {
        db.serialize(function () {
            var hashed_password = crypto.createHash('sha256').update(password).digest('hex');
            db.run('UPDATE users SET password = $password WHERE id = $id', { $password: hashed_password, $id: id }, function(err, row) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, row);
            });
        });
    });
};

exports.deleteUser = function (id, callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.run('DELETE FROM users WHERE id = $id ', { $id: id }, function (err, data) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, data);
            });
        });
    });
};