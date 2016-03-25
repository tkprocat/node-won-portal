var db = require('./db.js');

exports.findAll = function (callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.all('SELECT * FROM computers', [], function (err, rows) {
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
            db.get('SELECT * FROM computers WHERE name = ?', [name], function (err, row) {
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
            db.get('SELECT * FROM computers WHERE ID = ?', [id], function (err, row) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, row);
            });
        });
    });
};

exports.createComputer = function (name, ip, mac, callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.run('INSERT INTO computers VALUES (?, ?, ?, ?)', [null, name, ip, mac], function (err, row) {
                if (err)
                    return callback(err, null);
                return callback(null, row);
            });
        });
    });
};

exports.deleteComputer = function (id, callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.run('DELETE FROM computers WHERE id = ?', [id], function (err, data) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, data);
            });
                });
    });
};

exports.updateComputer = function (id, name, ip, mac, callback) {
    process.nextTick(function () {
        db.serialize(function () {
            db.run('UPDATE computers SET name = $name, ip = $ip, mac = $mac WHERE id = $id', { $id: id, $name: name, $ip: ip, $mac: mac }, function (err, data) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, data);
            });
        });
    });
};