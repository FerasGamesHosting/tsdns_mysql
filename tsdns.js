"use strict";
var net = require('net');
const db = require('./mysql.js').pool;
var sockets = [];

var tsdns = net.createServer(function (socket) {
    sockets.push(socket);
    var writeEnd = function (message) {
        socket.write(message, function () {
            socket.end();
        });
    };
    var freeTimeout = setTimeout(function () {
        writeEnd('404');
    }, 60000);
    socket.on('data', function (data) {
        var domain = data.toString().replace(/\r|\n/g, '');
        db.getConnection((error, conn) => {
            if (error) {
                console.log('Erro ao conectar no banco!');
            } else {
                conn.query("select zone, concat(target,':',port) as target from zonas where zone=?", domain, function (err, rows) {
                    
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(rows);
                        if (rows.length) {
                            writeEnd(rows[0].target);
                        } else {
                            writeEnd('404');
                        }
                    }
                    conn.release();
                });
            }
        });

    });
    socket.on('close', function () {
        for (var i in sockets) {
            if (sockets[i] === socket) {
                sockets.splice(i, 1);
            }
        }
    })
    socket.on('error', function (error) { });
});
tsdns.on('close', function () {
    db.close();
})

module.exports = tsdns;
