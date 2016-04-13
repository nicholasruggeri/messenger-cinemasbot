"use strict";

// Dipendenze terze parti
var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    ua = require('universal-analytics');

var app = express();

// Node.js Example
app.get('/', function (req, res) {

    console.log('req', req)
    console.log('res', res)

    if (req.query['hub.verify_token'] === "majora-2001-messenger-cinemasbot") {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }

});



app.listen(process.env.PORT);
console.log('Magic happens on port ' + process.env.PORT);
