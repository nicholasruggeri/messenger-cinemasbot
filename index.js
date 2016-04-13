"use strict";

// Dipendenze terze parti
var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    ua = require('universal-analytics');

// Dipendenze
var helpers = require('./helpers/helpers'),
    services = require('./services/services'),
    events = require('./events/events'),
    commands = require('./commands');

var app = express(),
    token = process.env.TELEGRAM_TOKEN,
    visitor = ua(process.env.UA_TOKEN);

var qs = {}; // object containing the query string that will be serialized

var session_request = {},
    session_location = false,
    session_theaters = false,
    session_movies = false,
    session_theater_selected = false;

let user_location;

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.get('/', function (req, res) {
    console.log('ok')
});

app.listen(process.env.PORT);
console.log('Magic happens on port ' + process.env.PORT);
