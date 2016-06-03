"use strict";

let request = require('request'),
    _u      = require('underscore');

module.exports = {

    sendTextMessage: (token, sender, text) => {
        let messageData = {
            text: text
        }
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: token
            },
            method: 'POST',
            json: {
                recipient: {
                    id: sender
                },
                message: messageData,
            }
        }, (error, response, body) => {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    },


    returnTheaters: (token, sender, data) => {

        console.log('DATA', data)

        let messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": []
                }
            }
        };

        for (let i=0; i<data.length; i++) {
            messageData.attachment.payload.elements.push({
                "title": data[i],
                "subtitle" : `Option ${i+1}`,
                "buttons": [{
                    "type": "postback",
                    "title": "This is good",
                    "payload": data[i]
                }],
            })
        }


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: token
            },
            method: 'POST',
            json: {
                recipient: {
                    id: sender
                },
                message: messageData,
            }
        }, (error, response, body) => {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    },


    returnMovies: (token, sender, data) => {
        var messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": []
                }
            }
        };

        for (let i=0; i<data.length; i++) {
            console.log(data[i])
            messageData.attachment.payload.elements.push({
                "title" : data[i].name,
                "subtitle" : data[i].times,
                "image_url" : data[i].poster
            })
        }


        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: token
            },
            method: 'POST',
            json: {
                recipient: {
                    id: sender
                },
                message: messageData,
            }
        }, (error, response, body) => {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }
}

