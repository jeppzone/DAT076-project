/**
 * Created by Oskar Jönefors on 2017-03-01.
 */

var Errors = require('../errors');
var Cfg = require('../configuration');
var Reviews = require('../middleware/reviews');

module.exports = function(express) {
    var router = express.Router();

    /**
     * Get the latest reviews by all users. At most 20 reviews,
     * but a lower number can be set in the query parameter "limit".
     *
     * If token is submitted, only reviews by followed users will be shown.
     *
     * Returns HTTP Status 200 if successful
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

    return router;
};