var config = {};

config.machines = [{
	name: 'NUC', ip: '192.168.2.20', mac: 'c0:3f:d5:63:92:be'
}];
config.users = [{
	id: 1, username: 'admin', password: '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b' //sha256 hash
}];

config.port = 3000;


module.exports = config;