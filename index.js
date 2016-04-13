
var util = require('util');

var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request');

var app = express(),
    token = process.env.FB_TOKEN;

function sendTextMessage(sender, text) {
    var messageData = {
        text: text
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

function sendGenericMessage(sender) {
  var messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Batman VS Superman",
          "subtitle": "17:30 - 19:30 - 21:30 - 23:00",
          "image_url": "https://s.yimg.com/ny/api/res/1.2/gyFqKB85n5rFl4e1SpvJDg--/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9ODAwO2lsPXBsYW5l/http://l.yimg.com/cd/resizer/2.0/FIT_TO_WIDTH-w1280/08d16d4567f303c46f16a66041eca2f620352f4b.jpg",
          // "buttons": [
          //     {
          //       "type": "web_url",
          //       "url": "https://www.messenger.com/",
          //       "title": "Web url"
          //     }, {
          //       "type": "postback",
          //       "title": "Postback",
          //       "payload": "Payload for first element in a generic bubble",
          //     }
          // ],
        },{
          "title": "Kung Fu Panda 3",
          "subtitle": "17:00 - 19:00 - 21:00",
          "image_url": "http://valecenter.it/wp-content/uploads/2016/03/kung-fu-panda-3-poster-full.jpg",
          // "buttons": [{
          //   "type": "postback",
          //   "title": "Postback",
          //   "payload": "Payload for second element in a generic bubble",
          // }],
        }]
      }
    }
  };
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

    var messaging_events = req.body.entry[0].messaging;

    console.log('me', messaging_events)

    // for (var i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[0];
        var sender = event.sender.id;

        // console.log(util.inspect(event, {showHidden: true, depth: 5}));

        if (event.message && event.message.text) {
            var text = event.message.text;
            // Handle a text message from this sender
            if (text === 'The Space Silea') {
                sendGenericMessage(sender);
                // continue;
            } else {
                sendTextMessage(sender, "Theater not found, sorry...");
            }
        } else {
            sendGenericMessage(sender);
        }

        // if (event.message.attachments[0].payload.coordinates) {

        //     console.log(event.message.attachments[0].payload.coordinates)
        //     console.log('ok, position')

        // } else {
        //     console.log('not location')
        // }

        // if (event.postback) {
        //     text = JSON.stringify(event.postback);
        //     sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
        //     continue;
        // }

    // }

    res.sendStatus(200);

});

app.listen(process.env.PORT);

console.log('Magic happens on port ' + process.env.PORT);
