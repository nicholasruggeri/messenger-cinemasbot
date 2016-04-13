"use strict";

// Dipendenze terze parti
var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    ua = require('universal-analytics');

// // Dipendenze
// var helpers = require('./helpers/helpers'),
//     services = require('./services/services'),
//     events = require('./events/events'),
//     commands = require('./commands');

var app = express(),
    token = process.env.TELEGRAM_TOKEN,
    visitor = ua(process.env.UA_TOKEN);

var qs = {}; // object containing the query string that will be serialized

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.get('/', function (req, res) {
    res.send('1729453501')
});

app.listen(process.env.PORT);
console.log('Magic happens on port ' + process.env.PORT);
