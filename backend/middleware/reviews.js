/**
 * Created by Oskar Jönefors on 2/26/17.
 */

var Cfg = require('../configuration');
var Errors = require('../errors');
var Movies = require('./movies');
var Review = require('../models/internal/review');

module.exports = {
    getAverageScore: getAverageScore,
    getReviews: getReviews,
    getReviewsByMovie: getReviewsByMovie,
    postReview: postReview,
    deleteReview: deleteReview,
    voteOnReview: voteOnReview
};

/**
 * Get all reviews for the given movie
 * @param tmdbMovieId - TMDB movie id. Must be a number
 * @param limit - How many reviews to return.
 * @param userId - Optional. If supplied, details regarding the user votes on reviews will be supplied.
 * @returns {Promise|*} - An array of reviews without movie information.
 */
function getReviewsByMovie(tmdbMovieId, limit, userId) {
    return Review.find({
        tmdbMovieId: tmdbMovieId
    })
        .sort({ date: -1 })
        .limit(limit ? limit : Cfg.LATEST_REVIEWS_MAX_LIMIT)
        .populate('author');
}

/**
 * Get the latest reviews, possibly by a group of authors.
 * @param userIds - If unset, reviews by all authors will be returned.
 * @param limit - The number of reviews to return.
 * @param sortQuery - How to sort the reviews.
 * @returns {Promise}
 */
function getReviews(userIds, limit, sortQuery) {
    var query = userIds ? { author: { $in: userIds } } : {};

    return Review.find(query)
        .sort(sortQuery ? sortQuery : {})
        .limit(limit ? limit : 0)
        .populate('author movie');
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
                tmdbMovieId: movie.tmdbId
            })
            .then(function(foundReview) {
                if (!foundReview) {
                    foundReview = new Review({ author: user._id, tmdbMovieId: tmdbMovieId, movie: movie._id,
                    upvotes: [user._id]});
                }
                foundReview.score = score ? score : undefined;
                foundReview.text = text;
                foundReview.downvotes = [];
                foundReview.upvotes = [user._id];
                return foundReview.save();
            })
        });
}

function deleteReview(user, reviewId) {
    return Review.findById(reviewId)
        .then(function(foundReview) {
            if (!foundReview) {
                throw Errors.NOT_FOUND;
            } else if (!user._id.equals(foundReview.author)) {
                throw Errors.FORBIDDEN;
            } else {
                return foundReview.remove();
            }
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

/**
 * Vote on the given review
 * @param votingUserId - The id of the user voting
 * @param reviewId - Id of the review to vote on
 * @param vote - 1 or -1 depending on if it is an upvote or a downvote
 */
function voteOnReview(votingUserId, reviewId, vote) {
    if (vote !== 1 && vote !== -1 && vote !== 0 ) {
        throw Errors.BAD_REQUEST;
    }

    return Review.findById(reviewId)
        .then(function(foundReview) {
            if (!foundReview) {
                throw Errors.NOT_FOUND;
            }

            foundReview.upvotes = returnWithoutElement(foundReview.upvotes, votingUserId);
            foundReview.downvotes = returnWithoutElement(foundReview.downvotes, votingUserId);

            if (vote !== 0) { // Count the vote unless it was 0, in which case the user vote should be unset.
                (vote === 1 ? foundReview.upvotes : foundReview.downvotes).push(votingUserId);
            }

            return foundReview.save();
        });
}

function returnWithoutElement(array, element) {
    return array.filter(function(el) {
        return !el.equals(element);
    })
}
