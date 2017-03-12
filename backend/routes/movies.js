/**
 * Created by Oskar Jönefors on 2/26/17.
 */

var Errors = require('../errors');
var Status = require('http-status-codes');
var Promise = require('bluebird');
var Cfg = require('../configuration');
var Reviews = require('../middleware/reviews');
var TokenVerification = require('../middleware/tokens').tokenVerification;

module.exports = function(express) {

    var router = express.Router();
    router.use(TokenVerification);

    /**
     * Get the average score and the 10 latest reviews for the given movie.
     *
     * Returns a HTTP Status 200 if successful, an average score and a (possibly empty) array of reviews
     *
     * ## Errors (HTTP Status) ##
     *   not a valid movie id (400)
     */
    router.get('/:movieId', function(req, res) {
        if (isNaN(parseInt(req.params.movieId))) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            Promise.all([
                Reviews.getAverageScore(parseInt(req.params.movieId)),
                Reviews.getReviewsByMovie(parseInt(req.params.movieId), Cfg.NBR_REVIEWS_MOVIE_INFO,
                    req.user ? req.user._id : undefined)
            ])
                .spread(function(averageScore, reviews) {
                    res.send({ averageScore: averageScore, reviews: reviews });
                })
                .catch(function(err) {
                    Errors.sendErrorResponse(err, res);
                })
        }
    });

    /**
     * Get all reviews for the given movie.
     *
     * Returns a HTTP Status 200 if successful and a (possibly empty) array of reviews
     *
     * ## Errors (HTTP Status) ##
     *   not a valid movie id (400)
     */
    router.get('/:movieId/reviews', function(req, res) {
        if (isNaN(parseInt(req.params.movieId))) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            Reviews.getReviews(req.params.movieId)
                .then(function(reviews) {
                    res.send(reviews);
                })
                .catch(function(err) {
                    Errors.sendErrorResponse(err, res);
                });
        }
    });

    /**
     * Post or update a review of the given movie
     *
     * Takes a score and/or a review text in the body fields score and text.
     *
     * Returns a HTTP Status 201 if successful, and a review.
     *
     * ## Errors (HTTP Status) ##
     *   invalid token (401)
     *   malformed attributes (400)
     */
    router.post('/:movieId/reviews', function(req, res) {
        var body = req.body;
        var movieId = req.params.movieId;
        if (!req.user) {
            Errors.sendErrorResponse(Errors.UNAUTHORIZED, res);
        } else if (
            (!body.score && !body.text) || // A review must have either a score or a review text, or both.
            (body.text && body.text.length > Cfg.REVIEW_MAX_LENGTH) || // Enforce max review length
            (body.score && !isValidScore(body.score)) || // Score must be between 0 (to unset score) and 5,
            (isNaN(parseInt(req.params.movieId)))
        ) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            Reviews.postReview(body.score, body.text, req.user, movieId)
                .then(function(pubReview) {
                    res.status(Status.CREATED).send(pubReview);
                })
                .catch(function(err) {
                    Errors.sendErrorResponse(err, res);
                })
        }
    });

    return router;

};

function isValidScore(score) {
    var parsedScore = parseInt(score);
    return !isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= Cfg.MAX_SCORE
}
