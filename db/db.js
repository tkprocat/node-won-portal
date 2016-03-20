"use strict";
var fs = require("fs");
var path = require("path");
var file = path.join(__dirname, 'db.sqlite');
var exists = fs.existsSync(file);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);


//Check if the database exists and if not, initiate it.
if (!exists) {
    console.log('Creating sqlite DB.');
    db.serialize(function () {
        db.run("CREATE TABLE users (id integer PRIMARY KEY, username char(50), password char(65))");
        db.run("CREATE TABLE machines (id integer PRIMARY KEY, name char(50), ip char(15), mac char(17))");
        db.run("INSERT INTO users VALUES (?, ?, ?)", [null, "admin", require('crypto')().createHash('sha256').update("secret").digest('hex')]);
        db.run("INSERT INTO machines VALUES (?, ?, ?, ?)", [null, "test", "192.168.0.10", "01-23-45-67-89-ab"]);
    });
}

module.exports = db;
