var async = require('async');
var express = require('express');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
var methodOverride = require('method-override');
//var session = require('express-session');
var bodyParser = require('body-parser');
//var multer = require('multer');
var errorHandler = require('errorhandler');
var app = express();

var routers = require('./routers');
require('dotenv').load();
//app.use(express.bodyParser());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(routers);
var serveStatic = require('serve-static');

/*
  app.post('/bwbasis', function(req, res){
    let row1;
    let row2;
    let row3;
    let erg_array=[];;
    let id = req.body.ID;
    const query1= {
        name: 'basiswert',
        text: 'select * from basiswerte.basis where ID = $1',
        values: [id]
    }

    const query2= {
        name: 'mod',
        text: 'select * from basiswerte.modifikation where ID = $1',
        values: [id]
    }

    const query3= {
        name: 'final',
        text: 'select * from basiswerte.final where ID = $1',
        values: [id]
    }
 
    console.log(req.body);      // your JSON
    pool.connect(function(err, client, done) {
            if (err) { return console.error('error fetching client from pool', err); }
            client.query(query1, function(err, result){
                  if (err) { return console.error('error running query', err); }
                  //res.send(result);
                  console.log("Ergebnis1 erhalten: "+result.rows.length);
                  row1=result.rows[0];
                  //erg_array.concat(result.rows);
            client.query(query2, function(err, result) {
                  if (err) { return console.error('error running query', err); }
                  row2=result.rows[0];
                  //erg_array.concat(result.rows);
                  //console.log("ERG2: "+row2);

            client.query(query3, function(err, result) {
                  if (err) { return console.error('error running query', err); }
                  row3=result.rows[0];
                  //console.log("ERG3: "+row3);
                  erg_array=[row1,row2,row3];
                  //erg_array.concat(result.rows);
                  console.log("ERGEBNIS: "+JSON.stringify(erg_array));
                  res.send(erg_array);
                });
            });
                
            });
            client.release();
          });
});
*/ 

app.use(serveStatic(__dirname)).listen(8088, function(){
    console.log("Server Running on 8088...");
});
