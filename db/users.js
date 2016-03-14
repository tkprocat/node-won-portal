var config = require('../config.js');

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = config.users.length; i < len; i++) {
      var user = config.users[i];
      if (user.username === username) {
        return cb(null, user);
      }
    }
    return cb(null, null);
  });
};


exports.findById = function (id, cb) {
    process.nextTick(function () {
        var idx = id - 1;
        if (config.users[idx]) {
            cb(null, config.users[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}