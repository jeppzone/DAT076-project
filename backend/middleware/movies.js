/**
 * Created by Oskar Jönefors on 2017-03-01.
 */

var Cfg = require('../configuration');
var TMDB = require('./movie-api');
var Movie = require('../models/internal/movie');
var md5 = require('md5');

module.exports = { getMovie: getMovie };

function getMovie(movieId) {
    return Movie.findOne({ tmdbId: movieId })
        .then(function(foundMovie) {
            if (!foundMovie) {
                return TMDB.getMovie(movieId)
                    .then(function(response) {
                        var newMovie = new Movie({
                            tmdbId: response.id,
                            title: response.title,
                            releaseDate: response.release_date,
                            posterPath: response.poster_path,
                            tmdbHash: md5(response)
                        });
                        return newMovie.save();
                    })
            } else {
                if (foundMovie.lastActivity.getTime() + Cfg.MOVIE_REFRESH_MILLIS < Date.now()) {
                    console.log('Movie not refreshed in a while, fetching from TMDB.');
                    TMDB.getMovie(movieId)
                        .then(function(response) {
                            var newHash = md5(response);
                            if (tmdbHash !== foundMovie.tmdbHash) {
                                console.log('Movie updated');
                                foundMovie.title = response.title;
                                foundMovie.releaseDate = response.releaseDate;
                                foundMovie.posterPath = response.posterPath;
                                foundMovie.tmdbHash = newHash;
                                return foundMovie.save();
                            }
                            console.log('Movie not updated');
                        })
                }
                return foundMovie;
            }
        })
}