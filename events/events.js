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


    sendGenericMessage: (token, sender, data) => {
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
                        // },{
                        //     "title": "Kung Fu Panda 3",
                        //     "subtitle": "17:00 - 19:00 - 21:00",
                        //     "image_url": "http://valecenter.it/wp-content/uploads/2016/03/kung-fu-panda-3-poster-full.jpg",
                        // }
                    ]
                }
            }
        };

        data = _u.flatten(data);

        for (var i=0; i<data.length; i++) {
            console.log(_u.data[i])
            messageData.attachment.payload.elements.push({
                "title": data[i],
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




