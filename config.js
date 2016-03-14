var config = {};

config.machines = [{
       name: 'Example', ip: '192.168.2.1', mac: 'AA:BB:CC:DD:EE:FF'
    }];
config.users = [{
        id: 1, username: 'admin', password: '2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b' //sha256 hash
    }];
config.port = 443;


module.exports = config;