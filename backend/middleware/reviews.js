/**
 * Created by Oskar Jönefors on 2/26/17.
 */

var Cfg = require('../configuration');
var Movies = require('./movies');
var Review = require('../models/internal/review');
var PublicReview = require('../models/external/review');
var PublicFullReview = require('../models/external/full-review');

module.exports = {
    getAverageScore: getAverageScore,
    getLatestReviews: getLatestReviews,
    getReviews: getReviews,
    postReview: postReview
};

/**
 * Get all reviews for the given movie
 * @param tmdbMovieId - TMDB movie id. Must be a number
 * @limit limit - How many reviews to return.
 * @returns {Promise|*} - An array of reviews without movie information.
 */
function getReviews(tmdbMovieId, limit) {
    return Review.find({
        tmdbMovieId: tmdbMovieId
    })
        .sort({ date: -1 })
        .limit(limit ? limit : Cfg.LATEST_REVIEWS_MAX_LIMIT)
        .populate('author')
        .then(function(reviews) {
            return reviews.map(function(r) {
                return new PublicReview(r);
            })
        })
}

/**
 * Get the latest reviews, possibly by a group of authors.
 * @param userIds - If unset, reviews by all authors will be returned.
 * @param limit - The number of reviews to return.
 * @returns {Promise}
 */
function getLatestReviews(userIds, limit) {
    var query = userIds ? { author: { $in: userIds } } : {};

    return Review.find(query)
        .sort({ date: -1 })
        .limit(limit ? limit : 0)
        .populate('author movie')
        .then(function(reviews) {
            return reviews.map(function(r) {
                return new PublicFullReview(r);
            })
        })
}

/**
 * Post a review for the given user.
 * @param score - A number 1-5. If 0 or missing, the score will be removed from the review.
 * @param text - Maximum of 3000 characters
 * @param user - Author of the review
 * @param tmdbMovieId - TMDB movie id for the movie
 * @returns {Promise|*} - A review object
 */
function postReview(score, text, user, tmdbMovieId) {
    return Movies.getMovie(tmdbMovieId) //Make sure movie exists
        .then(function(movie) {
            return Review.findOne({
                author: user._id,
                tmdbMovieId: movie.tmdbMovieId
            })
            .then(function(foundReview) {
                if (!foundReview) {
                    foundReview = new Review({ author: user._id, tmdbMovieId: tmdbMovieId, movie: movie._id });
                }
                foundReview.score = score ? score : undefined;
                foundReview.text = text;
                return foundReview.save();
            })
        })
        .then(function(savedReview) {
            savedReview.author = user;
            return new PublicReview(savedReview);
        })
}

function getAverageScore(mId) {
    return Review.aggregate([
            { $match: { tmdbMovieId: mId }},
            { $group: {
                _id: "$movieId",
                averageScore: { $avg: "$score" }
            }}
        ])
        .then(function(reviewSummary) {
            if (reviewSummary && reviewSummary.length) {
                return reviewSummary[0].averageScore
            } else {
                return 0
            }
        })
}