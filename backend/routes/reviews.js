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
     * To only show the reviews of users you are following, set the query parameter "show" to "feed"
     *
     * If token is submitted, details regarding the recipient user's votes will be returned.
     *
     * Returns HTTP Status 200 if successful
     *
     * ## Error (HTTP Status) ##
     *   token was invalid (401)
     *
     */
    router.get('/latest', function(req, res) {

        var limit = Cfg.LATEST_REVIEWS_MAX_LIMIT;
        var showFeed = req.query.show && req.query.show === 'feed';

        if (req.query.limit) {
            var iLimit = parseInt(req.query.limit);
            limit = !isNaN(iLimit) && iLimit < Cfg.LATEST_REVIEWS_MAX_LIMIT ? iLimit : limit;
        }

        Reviews.getReviews(req.user && showFeed ? req.user.following : undefined, limit, req.user ? req.user._id : undefined)
            .then(function(pubReviews) {
                res.send({reviews: pubReviews});
            })
            .catch(function(err) { Errors.sendErrorResponse(err, res) });
    });

    /**
     * Return all reviews. Supply token to show details of user votes on reviews.
     * Optionally, query parameter "sortby" can be set to "date" or "votes", and query parameter "sortorder" can be
     * set to "desc" or "asc" to specify sorting parameter and sort order.
     *
     * Returns HTTP Status 200 if successful, with review array in body attribute "reviews"
     *
     * ## Errors (HTTP Status) ##
     *   token was invalid (401)
     */
    router.get('/all', function(req, res) {

        var sortQuery = {};
        if (req.query.sortby) {
            var sortOrder = req.query.sortorder && req.query.sortorder === 'desc' ? -1 : 1;
            sortQuery = req.query.sortby === 'date' ? { date: sortOrder } :
                (req.query.sortby === 'votes' ? { voteScore: sortOrder } : {});
        }

        Reviews.getReviews(undefined, 0, req.user._id, sortQuery)
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

    /**
     * Vote on reviews. Send a vote with value 1, -1 or 0 in the query parameter "vote"
     * to upvote, downvote, or reset your vote.
     *
     * Returns HTTP Status 200 if successful, together with the review in the body.
     *
     * ## Errors (HTTP Status) ##
     *   token was missing, vote was missing or had the wrong value (400)
     *   token was invalid (401)
     *   review could not be found (404)
     *
     */
    router.put('/:reviewId', function(req, res) {

        if (!req.user || !req.query.vote || isNaN(parseInt(req.query.vote))) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else if (!Util.isValidObjectId(req.params.reviewId)) {
            Errors.sendErrorResponse(Errors.NOT_FOUND, res);
        } else {
            Reviews.voteOnReview(req.user._id, req.params.reviewId, parseInt(req.query.vote))
                .then(function(savedPubReview) {
                    //Success
                    res.send(savedPubReview);
                })
                .catch(function(err) { Errors.sendErrorResponse(err, res) });
        }

    });

    return router;
};