var request = require('request'),
    cheerio = require('cheerio');

var helpers = require('../helpers/helpers');

module.exports = {

    getCinema: function(location, callback){
        var googleUrl = 'http://www.google.it/movies?near='+location;
        request(googleUrl, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                var list_theaters = [];
                $('.theater .desc .name a').each(function(index){
                    var element = {};
                    var data = $(this);
                    var name = data.text(),
                        info = data.parent().parent().find('.info').text(),
                        link = data.attr('href');
                    element = name;
                    list_theaters.push(element);
                });
                // console.log(list_theaters)
                if (typeof callback == "function")
                    return callback(list_theaters);
                else
                    return list_theaters;
            } else {
                console.log("ERROR GETCINEMA", err); return;
            }
        });
    },

    getMovies: function(location, theater, callback){

        return new Promise((resolve,reject)=>{

            var googleUrl = 'http://www.google.it/movies?near='+location;

            request(googleUrl, function(error, response, html){
                if(!error){

                    var $ = cheerio.load(html);
                    var movies = [];
                    var movies_promise = [];

                    $('.theater .desc .name a').each(function(index){
                        var text = $(this).text()
                        if (text == theater){
                            var data = $(this);


                            data.parent().parent().siblings('.showtimes').find('.movie').each(function(){

                                var element = {};
                                var data = $(this);
                                var name = data.find('.name a').text();
                                var movieTimes = data.find('.times').text();

                                movies_promise.push(new Promise((resolve, reject) => {

                                    request('http://www.omdbapi.com/?t='+name+'&r=json', function (error, response, body) {
                                        if (!error && response.statusCode == 200) {

                                            const movieResponse = JSON.parse(body);

                                            element.name = name;
                                            element.times = movieTimes;
                                            element.poster = movieResponse.Poster;
                                            movies.push(element);

                                        } else {
                                            console.log("Got an error: ", error, ", status code: ", response.statusCode);
                                        }

                                        resolve()
                                    });

                                }).then((data) => {



                                }).catch((response) => {
                                    console.log('error', response)
                                }));

                            });



                        }
                    });

                    Promise.all(movies_promise).then(()=>{
                        resolve(movies)
                    })
                } else {
                    console.log("ERROR GETMOVIES", err); return;
                }
            });

        })

    },

    getTimes: function(location, theater, movie, callback){
        var googleUrl = 'http://www.google.it/movies?near='+location;
        request(googleUrl, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                $('.theater .desc .name a').each(function(){
                    var text = $(this).text()
                    if (text == theater){
                        var data = $(this);
                        data.parent().parent().siblings('.showtimes').find('.movie').each(function(){
                            var text = $(this).find('.name').text();
                            if (text == movie){
                                var data = $(this);
                                var movieTimes = data.find('.times').text();
                                var responseTimes = "The show times for " + decodeURI(movie) + " are: " + movieTimes + ". " + helpers.textResponse.beer;
                                if (typeof callback == "function")
                                    return callback(responseTimes);
                                else
                                    return responseTimes;
                            }
                        });
                    }
                });
            } else {
                console.log("ERROR GETTIMES", err); return;
            }
        });
    }
}