/**
 * Created by Oskar Jönefors on 2017-03-01.
 */

var Errors = require('../errors');
var Cfg = require('../configuration');
var Reviews = require('../middleware/reviews');
var Util = require('../middleware/util');

var PublicReview = require('../models/external/review');
var PublicFullReview = require('../models/external/full-review');

module.exports = function(express) {
    var router = express.Router();

    /**
     * Get reviews. Supply token to show details of user votes on reviews.
     * Optionally, query parameter "sortby" can be set to "date" or "votes", and query parameter "sortorder" can be
     * set to "desc" or "asc" to specify sorting parameter and sort order.
     * To only show the reviews of users you are following, set the query parameter "show" to "feed"
     * Query parameter "limit" can be set to limit the number of results.
     *
     * Returns HTTP Status 200 if successful, with review array in body attribute "reviews"
     *
     * ## Errors (HTTP Status) ##
     *   token was invalid (401)
     */
    router.get('/', function(req, res) {

        var showFeed = req.query.show && req.query.show === 'feed';

        var limit = 0;
        if (req.query.limit) {
            var iLimit = parseInt(req.query.limit);
            limit = !isNaN(iLimit) && iLimit < Cfg.LATEST_REVIEWS_MAX_LIMIT ? iLimit : limit;
        }

        var sortQuery = {};
        if (req.query.sortby) {
            var sortOrder = req.query.sortorder && req.query.sortorder === 'desc' ? -1 : 1;
            sortQuery = req.query.sortby === 'date' ? { date: sortOrder } :
                (req.query.sortby === 'votes' ? { voteScore: sortOrder } : {});
        }

        Reviews.getReviews(req.user && showFeed ? req.user.following : undefined, limit, sortQuery)
            .then(function(reviews) {
                res.send({reviews: reviews.map(function(r) {
                    return new PublicFullReview(r, req.user ? req.user._id : undefined);
                })});
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
                .then(function(savedReview) {
                    //Success
                    res.send(new PublicReview(savedReview, req.user._id));
                })
                .catch(function(err) { Errors.sendErrorResponse(err, res) });
        }

    });

    return router;
};