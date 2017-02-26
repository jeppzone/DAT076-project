/**
 * Created by Oskar Jönefors on 2/26/17.
 */

var Review = require('../models/internal/review');
var PublicReview = require('../models/external/review');

module.exports = {
    getAverageScore: getAverageScore,
    getReviews: getReviews,
    postReview: postReview
};

/**
 * Get all reviews for the given movie
 * @param movieId - Must be a number
 * @returns {Promise|*} - An array of reviews
 */
function getReviews(movieId, limit) {
    return Review.find({
        movieId: movieId
    })
        .sort({ date: -1 })
        .limit(limit ? limit : 0)
        .populate('author')
        .then(function(reviews) {
            return reviews.map(function(r) {
                return new PublicReview(r);
            })
        })
}

/**
 * Post a review for the given user.
 * @param score - A number 1-5. If 0 or missing, the score will be removed from the review.
 * @param text - Maximum of 3000 characters
 * @param user - Author of the review
 * @param movieId - Id for the movie
 * @returns {Promise|*} - A review object
 */
function postReview(score, text, user, movieId) {
    return Review.findOne({
        author: user._id,
        movieId: movieId
    })
        .then(function(foundReview) {
            if (!foundReview) {
                foundReview = new Review({ author: user._id, movieId: movieId });
            }
            foundReview.score = score ? score : undefined;
            foundReview.text = text;
            return foundReview.save();
        })
        .then(function(savedReview) {
            savedReview.author = user;
            return new PublicReview(savedReview);
        })
}

function getAverageScore(mId) {
    return Review.aggregate([
            { $match: { movieId: mId }},
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