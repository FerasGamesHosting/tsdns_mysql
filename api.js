"use strict";

var express = require('express');
var app = express();
var config = require('./config.json');
const mysql = require('mysql');

const db = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.database
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

db.query("CREATE TABLE IF NOT EXISTS zones (id integer primary key AUTO_INCREMENT, zone varchar(100),target varchar(50))");


app.get('/list', function (req, res) {
  if( req.headers.authorization == config.api_key ){
    var zone = req.params.zone;
    db.query("SELECT * FROM zones", function(err, rows) {
      res.send('{"result":"success","message":' + JSON.stringify( rows ) + '}');
      console.log('Consultando base completa :o, tu ta doido!');
    });
  }else{
    res.statusCode = 403;
    res.send('{"result":"error","message":"Invalid auth token"}');
  }
});

app.get('/add/:zone/:target', function (req, res) {
  if( req.headers.authorization == config.api_key ){
    var zone = req.params.zone;
    var target = req.params.target;
    db.query("SELECT * FROM zones WHERE zone=?",zone, function(err, row) {
    if(row != '')
    {
      console.log("caiu no existe!");
    }else
    {
      var sql = "INSERT INTO zones(zone,target) VALUES(?,?)";
      db.query(sql,[zone,target]);
    }
      res.statusCode = 201;
      res.send('{"result":"success","message":' + JSON.stringify( row ) + '}');
      console.log('Zona: ' + zone + ' existe!');
    });
      
  }else{
    res.statusCode = 403;
    res.send('{"result":"error","message":"Invalid auth token"}');
  }
});

app.get('/del/:zone', function (req, res) {
  if( req.headers.authorization == config.api_key ){
    var zone = req.params.zone;
    var sql = "DELETE FROM zones WHERE zone =?";
    db.query(sql,zone, function(err, row) {
      res.statusCode = 202;
      res.send('{"result":"success","message":' + JSON.stringify( row ) + '}');
      console.log('Zona: ' + zone + ' deletada com sucesso!');
    });
   
  }else{
    res.statusCode = 403;
    res.send('{"result":"error","message":"Invalid auth token"}');
  }
});

app.get('/get/:zone', function (req, res) {
  if( req.headers.authorization == config.api_key ){
    var zone = req.params.zone;
    db.query("SELECT * FROM zones WHERE zone=?",zone, function(err, row) {
      res.statusCode = 200;
      res.send('{"result":"success","message":' + JSON.stringify( row ) + '}');
      console.log('Zona: ' + zone + ' consultada com sucesso!');
    });
  }else{
    res.statusCode = 403;
    res.send('{"result":"error","message":"Invalid auth token"}');
  }
});

module.exports = app;
