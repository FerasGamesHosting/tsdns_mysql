"use strict";
var express = require('express');
var app = express();
var config = require('./config.json');
const db = require('./mysql').pool;

db.getConnection((error, conn) => {
    conn.query("CREATE TABLE IF NOT EXISTS zonas (id integer primary key AUTO_INCREMENT, zone varchar(100),target varchar(50),port varchar(10))");
    conn.release();
});


app.get('/list', function (req, res) {
    if (req.headers.authorization == config.api_key) {
        var zone = req.params.zone;
        db.getConnection((error, conn) => {
            if (error) {
                console.log('Erro ao conectar no banco!');
            } else {
                conn.query("SELECT * FROM zonas", function (err, rows) {
                    conn.release();
                    res.send('{"result":"success","message":' + JSON.stringify(rows) + '}');
                    console.log('Consultando base completa :o, tu ta doido!');
                });
            }
        });
    } else {
        res.statusCode = 403;
        res.send('{"result":"error","message":"Invalid auth token"}');
    }
});

app.get('/add/:zone/:target', function (req, res) {
    if (req.headers.authorization == config.api_key) {
        var zone = req.params.zone;
        var ipVetor = req.params.target.split(':');
        var target = ipVetor[0];
        var port = ipVetor[1];
        if (ipVetor.length > 1) {

            db.getConnection((error, conn) => {
                if (error) {
                    console.log('Erro ao conectar no banco!');
                } else {
                    conn.query("SELECT * FROM zonas WHERE zone=? ", zone, function (err, rows) {
                        if (err) {
                            console.log('Erro ao conectar no banco!');
                        } else {
                            if (rows == '') {
                                var sql = "INSERT INTO zonas(zone,target,port) VALUES(?,?,?)";
                                conn.query(sql, [zone, target, port]);
                                res.statusCode = 201;
                                res.send('{"result":"success"}');
                                console.log('Zona: ' + zone + ' criada!');
                            } else {
                                console.log('Registro já existe!');
                            }
                            conn.release();
                        }
                    });
                }
            });
        }

    } else {
        res.statusCode = 403;
        res.send('{"result":"error","message":"Invalid auth token"}');
    }
});

app.get('/del/:zone', function (req, res) {
    if (req.headers.authorization == config.api_key) {
        var zone = req.params.zone;
        var sql = "DELETE FROM zonas WHERE zone =?";
        db.getConnection((error, conn) => {
            if (error) {
                console.log('Erro ao conectar no banco!');
            } else {
                conn.query(sql, zone, function (err, row) {
                    res.statusCode = 202;
                    res.send('{"result":"success","message":' + JSON.stringify(row) + '}');
                    console.log('Zona: ' + zone + ' deletada com sucesso!');
                });
                conn.release();
            }
        });

    } else {
        res.statusCode = 403;
        res.send('{"result":"error","message":"Invalid auth token"}');
    }
});

app.get('/get/:zone', function (req, res) {
    if (req.headers.authorization == config.api_key) {
        var zone = req.params.zone;
        db.getConnection((error, conn) => {
            if (error) {
                console.log('Erro ao conectar no banco!');
            } else {
                conn.query("SELECT * FROM zonas WHERE zone=?", zone, function (err, row) {
                    res.statusCode = 200;
                    res.send('{"result":"success","message":' + JSON.stringify(row) + '}');
                    console.log('Zona: ' + zone + ' consultada com sucesso!');
                });
                conn.release();
            }
        });
    
} else {
        res.statusCode = 403;
        res.send('{"result":"error","message":"Invalid auth token"}');
    }
});

module.exports = app;
