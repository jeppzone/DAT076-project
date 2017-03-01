/**
 * Created by Oskar Jönefors on 2017-03-01.
 */

var Errors = require('../errors');
var Cfg = require('../configuration');
var Reviews = require('../middleware/reviews');
var Util = require('../middleware/util');

module.exports = function(express) {
    var router = express.Router();

    /**
     * Get the latest reviews by all users. At most 20 reviews,
     * but a lower number can be set in the query parameter "limit".
     *
     * If token is submitted, only reviews by followed users will be shown.
     *
     * Returns HTTP Status 200 if successful
     *
     * ## Error (HTTP Status) ##
     *   token was invalid (401)
     *
     */
    router.get('/latest', function(req, res) {

        var limit = Cfg.LATEST_REVIEWS_MAX_LIMIT;

        if (req.query.limit) {
            var iLimit = parseInt(req.query.limit);
            limit = !isNaN(iLimit) && iLimit < Cfg.LATEST_REVIEWS_MAX_LIMIT ? iLimit : limit;
        }

        Reviews.getLatestReviews(req.user ? req.user.following : undefined, limit)
            .then(function(pubReviews) {
                res.send({reviews: pubReviews});
            })
            .catch(function(err) { Errors.sendErrorResponse(err, res) });
    });

    /**
     * Delete review with the given id.
     *
     * Returns HTTP Status 200 if successful.
     *
     * ## Error (HTTP Status) ##
     *  token was missing (400)
     *  token was invalid (401)
     *  user did not write the review (403)
     *  review could not be found (404)
     *
     */
    router.delete('/:reviewId', function(req, res) {

        if (!req.user) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else if (!Util.isValidObjectId(req.params.reviewId)) {
            Errors.sendErrorResponse(Errors.NOT_FOUND, res);
        } else {
            Reviews.deleteReview(req.user, req.params.reviewId)
                .then(function() {
                    //Success
                    res.send();
                })
                .catch(function(err) { Errors.sendErrorResponse(err, res) })
        }

    });

    return router;
};