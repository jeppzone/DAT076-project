/**
 * Created by Oskar Jönefors on 2017-03-01.
 */

var Cfg = require('../configuration');
var TMDB = require('./movie-api');
var Movie = require('../models/internal/movie');
var md5 = require('md5');

module.exports = { getMovie: getMovie };

/**
 * Get the movie with the given TMDB id. If the movie has not been fetched from TMDB before, it will be. Otherwise,
 * the movie details will be fetched from the local database.
 * @param movieId - TMDB movie id
 * @returns {Promise|*} - A movie database object.
 */
function getMovie(movieId) {
    return Movie.findOne({ tmdbId: movieId })
        .then(function(foundMovie) {
            if (!foundMovie) {
                // First time fetching the movie. Get movie details from TMDB API and save to local database.
                return TMDB.getMovie(movieId)
                    .then(function(response) {
                        var newMovie = new Movie({
                            tmdbId: response.id,
                            title: response.title,
                            releaseDate: response.release_date,
                            posterPath: response.poster_path
                        });
                        return newMovie.save();
                    })
            } else {
                if (foundMovie.lastActivity.getTime() + Cfg.MOVIE_REFRESH_MILLIS < Date.now()) {
                    // The movie has not been fetched in a while, so a new request will be sent to TMDB to update
                    // the movie data. However, the data already stored in the database will be immediately returned,
                    // and will not wait for the TMDB API to respond.
                    TMDB.getMovie(movieId)
                        .then(function(response) {
                            foundMovie.title = response.title;
                            if (response.releaseDate) {
                                foundMovie.releaseDate = response.releaseDate;
                            }
                            foundMovie.posterPath = response.posterPath;
                            foundMovie.lastActivity = Date.now();
                            return foundMovie.save();
                        })
                }
                return foundMovie;
            }
        })
}