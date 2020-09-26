const mysql = require('mysql');
var config = require('./config.json');

var pool = mysql.createPool({
    connectionLimit: config.limitCon,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

exports.pool = pool;