/**
 * Created by Oskar Jönefors on 2017-03-01.
 *
 * External representation of a movie coupled with a review.
 *
 */

var PublicMovie = require('./movie');
var PublicReview = require('./review');

module.exports = function(review, recipientId) {
    var pubReview = new PublicReview(review, recipientId);
    pubReview.movie = new PublicMovie(review.movie);
    return pubReview;
};