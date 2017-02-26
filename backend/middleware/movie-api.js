/**
 * Created by Oskar Jönefors on 2/26/17.
 */
var request = require('request-promise');
var Cfg = require('../configuration');
var Errors = require('../errors');

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'INSERT TMDB API KEY HERE';


module.exports = {
    getMovie: getMovie
};

/**
 * Get a movie from the API
 * @param movieId - Id for the movie to get
 * @returns {Promise} - Details for the movie, or a 404 if the movie was not found.
 */
function getMovie(movieId) {
    return getRequest('/movie/' + movieId)
        .then(function(foundMovie) {
            console.log(foundMovie);
        })
        .catch(function(err) {
            console.log(err);
            if (err.statusCode && err.statusCode === 404) {
                throw Errors.NOT_FOUND;
            } else {
                throw Errors.UNKNOWN_ERROR;
            }
        })
}


function getRequest(endPoint, method) {
    return request({
        method: method ? method : 'GET',
        uri: BASE_URL + endPoint,
        qs : { api_key: API_KEY },
        json: true
    })
}