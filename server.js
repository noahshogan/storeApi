//this is only an example, handling everything is yours responsibilty !

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Connection = require('tedious').Connection;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());
var DButilsAzure = require('./DBUtils');

var config = {
    userName: 'NoahShogan',
    password: 'iS5gumjx',
    server: 'shogan.database.windows.net',
    //requestTimeout: 30000,
    options: {encrypt: true, database: 'store'}
}

//-------------------------------------------------------------------------------------------------------------------
connection = new Connection(config);
var connected = false;
connection.on('connect', function(err) {
    if (err) {
        console.error('error connecting: ' + err.message);
    }
    else {
        console.log("Connected Azure");
        connected = true;
    }
});

//-------------------------------------------------------------------------------------------------------------------
app.use(function(req, res, next){
    if (connected)
        next();
    else
        res.status(503).send('Server is down');
});
//-------------------------------------------------------------------------------------------------------------------
app.get('/select1', function (req,res) {
    //it is just a simple example without handling the answer
    DButilsAzure.Select(connection, 'Select * from Score', function (result) {
        res.send(result);
    });
});
//-------------------------------------------------------------------------------------------------------------------

var port = 4000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
//-------------------------------------------------------------------------------------------------------------------


