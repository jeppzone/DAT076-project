/**
 * Created by Oskar Jönefors on 2017-02-28.
 */

var Errors = require('../errors');
var TokenVerification = require('../middleware/tokens').tokenVerification;
var Users = require('../middleware/users');
var Reviews = require('../middleware/reviews');

var PublicUser = require('../models/external/user');

module.exports = function(express) {

    var router = express.Router();

    /**
     * Return the user with the given username.
     *
     * Returns HTTP Status 200 if successful, together with the requested user.
     *
     * ## Errors (HTTP Status) ##
     *   user not found (404)
     *
     */
    router.get('/:username', function(req, res) {
        Users.getUser(req.params.username)
            .then(function(user) { res.send(new PublicUser(user)); })
            .catch(function(err) {
                Errors.sendErrorResponse(err, res);
            })
    });

    /**
    * Get the profile of the user with the supplied username.
    *
    * Returns HTTP Status 200 if successful, together with the user and profile information.
    *
    * ## Errors (HTTP Status) ##
    *   user not found (404)
    *
    */
    router.get('/:username/profile', function(req, res) {
        Users.getUserAndProfile(req.params.username)
            .then(function(pubUserAndProfile) {
                res.send(pubUserAndProfile);
            })
            .catch(function(err) { Errors.sendErrorResponse(err, res) })
    });


    /**
     * Get all reviews by the given user.
     *
     * Returns HTTP Status 200 if successful, together with the reviews in the response body.
     *
     * ## Errors (HTTP Status) ##
     *   user not found (404)
     *
     */
    router.get('/:username/reviews', function(req, res) {
        Users.getUser(req.params.username)
            .then(function(foundUser) {
                return Reviews.getLatestReviews(foundUser._id)
            })
            .then(function(publicReviews) {
                res.send({ reviews: publicReviews });
            })
            .catch(function(err) { Errors.sendErrorResponse(err, res) });
    });

    return router;

};