
var util        = require('util'),
    express     = require('express'),
    bodyParser  = require('body-parser'),
    request     = require('request');

var events = require('./events/events'),
    services = require('./services/services');

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

        // console.log(util.inspect(event, {showHidden: true, depth: 5}));

        if (event.message) {

            if (event.message.text){

                // console.log('MESSAGGIO DI TESTO')

                // var text = event.message.text;
                // if (text === 'The Space Silea') {
                //     events.sendGenericMessage(token, sender);
                //     continue;
                // } else {
                //     events.sendTextMessage(token, sender, "Theater not found, sorry...");
                // }

                events.sendTextMessage(token, sender, "Ehy, send your location.");

            } else if (event.message.attachments) {

                var lat = event.message.attachments[0].payload.coordinates.lat,
                    long = event.message.attachments[0].payload.coordinates.long,
                    coords = lat + ',' + long;

                console.log('MESSAGGIO NON DI TESTO')
                events.sendTextMessage(token, sender, "Great, now choose the theater you prefer.");
                services.getCinema(coords, function(list_theaters){
                    console.log('CALLBACK')
                    events.sendGenericMessage(token, sender, list_theaters);
                });

            }
        }
    }

    res.sendStatus(200);

});

app.listen(process.env.PORT);

console.log('Shit happens on port ' + process.env.PORT);
