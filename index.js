"use strict";

let util        = require('util'),
    express     = require('express'),
    _           = require('underscore'),
    bodyParser  = require('body-parser'),
    events      = require('./events/events'),
    services    = require('./services/services');


var app         = express(),
    token       = process.env.FB_TOKEN,
    qs, user_session = {};

const STATUSES = {
    INITIAL: 1,
    THEATERS_RECEIVED: 2,
    MOVIES_RECEIVED: 3
};

let removeData = (id) => {
    delete user_session[id]
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

    // console.log(util.inspect(req.body, {showHidden: false, depth: 5}));


    let messaging_events = req.body.entry[0].messaging;


    for (let i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[i];
        var sender_id = event.sender.id;

        if (!user_session[sender_id]){
            user_session[sender_id] = {
                id: sender_id,
                location: undefined,
                theater: undefined,
                movie: undefined,
                status: STATUSES.INITIAL
            }
        }

        if (event.message) {

            if (event.message.text){

                let user_text = event.message.text.toLowerCase();

                switch(user_text) {

                        case 'hello':
                        case 'hi':
                        case 'ciao':
                            events.sendTextMessage(
                                token,
                                user_session[sender_id].id,
                                `${event.message.text}`
                            );
                            break;

                        case 'help':
                        case 'aiuto':
                            events.sendTextMessage(
                                token,
                                user_session[sender_id].id,
                                "Just give me your location, if I can find out theaterrrrs here in the savannah, I can catch them everywhere."
                            );
                            break;

                        default:

                            events.sendTextMessage(
                                token,
                                user_session[sender_id].id,
                                "Have you ever hearrrrd about a lion known for its patience?"
                            );
                            setTimeout(()=>{
                                events.sendTextMessage(
                                    token,
                                    user_session[sender_id].id,
                                    "Me neitherrr."
                                );
                            }, 2000);


                    }

            } else if (event.message.attachments) {

                let lat    = event.message.attachments[0].payload.coordinates.lat,
                    long   = event.message.attachments[0].payload.coordinates.long,
                    coords = `${lat},${long}`;

                user_session[sender_id].status = STATUSES.INITIAL;
                user_session[sender_id].location = coords;

                events.sendTextMessage(
                    token,
                    user_session[sender_id].id,
                    "Fangtastic! I’m hunting down some theaterrrrs for you."
                );

                new Promise((resolve, reject) => {
                    services.getTheaters(user_session[sender_id].location, resolve, reject)
                }).then((list_theaters) => {

                    if (list_theaters.length > 0){
                        user_session[sender_id].status = STATUSES.THEATERS_RECEIVED;
                        events.returnTheaters(
                            token,
                            user_session[sender_id].id,
                            _.flatten(list_theaters)
                        );
                    } else {
                        user_session[sender_id].status = STATUSES.INITIAL;
                        events.sendTextMessage(
                            token,
                            user_session[sender_id].id,
                            "TEATRI NON TROVATI"
                        );
                    }

                })

            }

        } else if (event.postback) {

            switch(user_session[sender_id].status){
                case STATUSES.THEATERS_RECEIVED:

                    user_session[sender_id].theater = event.postback.payload;

                    console.log('enter postback', user_session[sender_id].theater)

                    new Promise((resolve, reject) => {

                        console.log('enter promise')

                        services.getMovies(user_session[sender_id].location, user_session[sender_id].theater, resolve, reject)

                    }).then((list_movies) => {

                        console.log('list_movies', list_movies)

                        events.returnMovies(
                            token,
                            user_session[sender_id].id,
                            _.flatten(list_movies)
                        );

                    });
                    break;
            }

        }


    }



    res.sendStatus(200);

});

app.listen(process.env.PORT);

console.log(`Shit happens on port ${process.env.PORT}`);