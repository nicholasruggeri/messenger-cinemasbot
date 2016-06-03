"use strict";

let util        = require('util'),
    express     = require('express'),
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

    console.log(util.inspect(req.body, {showHidden: false, depth: 5}));

    var from_id = req.body.entry[0].id;

    if (!user_session[from_id]){
        user_session[from_id] = {
            chat_id: req.body.message.chat.id,
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
                        events.sendTextMessage(token, user_session[from_id].id, `${event.message.text}`);
                        break;


                }

        }

    } else if (event.postback) {

    }


    res.sendStatus(200);

});

app.listen(process.env.PORT);

console.log(`Shit happens on port ${process.env.PORT}`);