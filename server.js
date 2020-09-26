var config = require('./config.json');
var api = require('./api.js');
var tsdns = require('./tsdns');

api.listen(config.api_port, config.api_ip, function () {
    console.log('Api webservice running at %s:%s', config.api_ip, config.api_port);
});

tsdns.listen(config.tsdns_port, config.tsdns_ip, function () {
    console.log('Tsdns running at %s:%s', config.tsdns_ip, config.tsdns_port);
});

