"use strict";

// Dipendenze terze parti
var express = require('express'),
    request = require('request');

var app = express();

var token = "CAAQX4MNgOq8BAEMfM4Bc3KslGYAl5QzsxcerpjZAX5bJrbMDmKkgPa4xWDmt1uT7qZCAQZBcQ4g865uvof267ikn5f2oRDChNCOoDy3f7ujGx9VT6ExB52HuH7GimPNP3sT0yyPPJ3eZCZCM1KJYEYMmqaHFNwPSUlFm7ZAWUg4ZBXfxoHSEEc1ORTojeZASCEwZD";

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

// Node.js Example
app.get('/', function (req, res) {

    if (req.query['hub.verify_token'] === "majora-2001") {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }

});

app.post('/', function (req, res) {

    console.log('res', res)

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
