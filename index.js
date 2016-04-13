
var util        = require('util'),
    express     = require('express'),
    bodyParser  = require('body-parser'),
    request     = require('request');

var events = require('./events/events');

var app = express(),
    token = process.env.FB_TOKEN;

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

    for (var i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        console.log(util.inspect(event, {showHidden: true, depth: 5}));

        if (event.message) {

            if (event.message.text){

                console.log('MESSAGGIO DI TESTO')

                var text = event.message.text;
                if (text === 'The Space Silea') {
                    events.sendGenericMessage(token, sender);
                    continue;
                } else {
                    events.sendTextMessage(token, sender, "Theater not found, sorry...");
                }

            } else if (event.message.attachments) {
                console.log('MESSAGGIO NON DI TESTO')
            }
        }
    }

    res.sendStatus(200);

});

app.listen(process.env.PORT);

console.log('Shit happens on port ' + process.env.PORT);
