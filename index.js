"use strict";

// Dipendenze terze parti
var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request');


var app = express();

var token = "CAAQX4MNgOq8BALoqRGUGDu3QJR18jiU0musa0HQTngkCP0JPgwpg3FWXxJ7RUDar5AnLViQHW345cwJawwEgztCvATnIoNLgVEaZBbIdxXP2ZA6ZBl9tlnlFZBZCLRJmaJavDDB6ckklxnukdFh7rahjQMhORa8YGR9L52bE4vfpWkL7LJwiHW5uL69U6EnEZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {

    if (req.query['hub.verify_token'] === "majora-2001") {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }

});

app.post('/', function (req, res) {

    console.log('req', req)

    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
            // Handle a text message from this sender
            sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
        }
    }
    res.sendStatus(200);
});



app.listen(process.env.PORT);
console.log('Magic happens on port ' + process.env.PORT);
