"use strict";

let util        = require('util'),
    express     = require('express'),
    bodyParser  = require('body-parser'),
    request     = require('request'),
    events      = require('./events/events'),
    services    = require('./services/services');

let app   = express(),
    token = process.env.FB_TOKEN;

let sender = {};

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

    let messaging_events = req.body.entry[0].messaging;

    for (let i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[i];
        var sender_id = event.sender.id;

        if (event.message) {

            if (event.message.text){

                sender[sender_id] = {
                    id: sender_id
                }

                let user_text = event.message.text.toLowerCase();

                switch(user_text) {

                    case 'hello':
                    case 'hi':
                    case 'ciao':
                        events.sendTextMessage(token, sender[sender_id].id, `${event.message.text} :)`);
                        break;

                    case 'help':
                    case 'aiuto':
                        events.sendTextMessage(token, sender[sender_id].id, "Help command");
                        break;

                    default:
                        events.sendTextMessage(token, sender[sender_id].id, "Ehy, send your location.");

                }

            } else if (event.message.attachments) {

                let lat    = event.message.attachments[0].payload.coordinates.lat,
                    long   = event.message.attachments[0].payload.coordinates.long,
                    coords = `${lat},${long}`;

                sender[sender_id].coords = coords;

                console.log('sender', sender) // QUA VEDO LE COORDINATE NELL'OGGETTO

                events.sendTextMessage(token, sender[sender_id].id, "Great, now choose the theater you prefer.");

                setTimeout( () => {
                    services.getCinema(sender[sender_id].coords, (list_theaters) => {
                        events.returnTheaters(token, sender[sender_id].id, list_theaters);
                    });
                }, 300)

            }
        } else if (event.postback) {

            console.log('sender', sender) // QUA NON VIENE PRESO L'OGGETTO CON LE COORDINATE

            let choosenTheater = event.postback.payload;
            events.sendTextMessage(token, sender[sender_id].id, "Ok, just a moment...");


            setTimeout(() => {

                services.getMovies(sender[sender_id].coords, choosenTheater).then((list_movies)=>{

                    let round = Math.round(list_movies.length/10);

                    if (list_movies.length > 10){

                        for (let i=0; i < round; i++) {

                            events.returnMovies(token, sender[sender_id].id, list_movies.slice(i*10,(i+1)*10));

                        }

                    } else {

                        console.log(list_movies)
                        events.returnMovies(token, sender[sender_id].id, list_movies);

                    }

                });

            }, 300)

        }
    }

    res.sendStatus(200);

});

app.listen(process.env.PORT);

console.log(`Shit happens on port ${process.env.PORT}`);