var request = require('request');
var _u = require('underscore');

module.exports = {

    sendTextMessage: (token, sender, text) => {
        var messageData = {
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
        var messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": []
                }
            }
        };

        for (var i=0; i<data.length; i++) {
            console.log(data[i])
            messageData.attachment.payload.elements.push({
                "title": 'Theater '+[i+1],
                "buttons": [{
                    "type": "postback",
                    "title": data[i],
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
                    "elements": [
                        // {
                        //     "title": "Batman VS Superman",
                        //     "subtitle": "17:30 - 19:30 - 21:30 - 23:00",
                        //     "image_url": "https://s.yimg.com/ny/api/res/1.2/gyFqKB85n5rFl4e1SpvJDg--/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9ODAwO2lsPXBsYW5l/http://l.yimg.com/cd/resizer/2.0/FIT_TO_WIDTH-w1280/08d16d4567f303c46f16a66041eca2f620352f4b.jpg",
                        // }
                    ]
                }
            }
        };

        for (var i=0; i<data.length; i++) {
            console.log(data[i])
            messageData.attachment.payload.elements.push({
                "title": data[i],
                "subtitle": "17:30 - 19:30 - 21:30 - 23:00",
                "image_url": "https://s.yimg.com/ny/api/res/1.2/gyFqKB85n5rFl4e1SpvJDg--/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9ODAwO2lsPXBsYW5l/http://l.yimg.com/cd/resizer/2.0/FIT_TO_WIDTH-w1280/08d16d4567f303c46f16a66041eca2f620352f4b.jpg"
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




