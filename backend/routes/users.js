/**
 * Created by Oskar Jönefors on 2017-02-28.
 */

var Cfg = require('../configuration');
var Errors = require('../errors');
var TokenVerification = require('../middleware/tokens').tokenVerification;
var Users = require('../middleware/users');
var Reviews = require('../middleware/reviews');
var MovieLists = require('../middleware/movie-lists');

var PublicUser = require('../models/external/user');

module.exports = function(express) {

    var router = express.Router();
    router.use(TokenVerification);

    /**
     * Search for users. Search string is passed in the query parameter "search".
     * Matches from the start of the username. Search string must be at least 3 characters long.
     *
     * ## Errors (HTTP Status)
     *   search query was missing or too short (400)
     *
     */
    router.get('/', function(req, res) {
        var searchString = req.query.search;

        if (!searchString || searchString.length < Cfg.SEARCH_MIN_LENGTH) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            Users.search(searchString)
                .then(function(foundUsers) {
                    var pubUsers = foundUsers.map(function(u) {
                        return new PublicUser(u);
                    });

                    res.send({ searchResults: pubUsers });
                })
                .catch(function(err) { Errors.sendErrorResponse(err, res) });
        }

    });

    /**
     * Return all users. If token is supplied, the requesting user will be omitted from results.
     *
     * Returns HTTP Status 200 if successful together with the user array in body parameter "users".
     *
     * ## Errors (HTTP Status) ##
     *   token was invalid (401)
     *
     */
    router.get('/all', function(req, res) {
        return Users.getAllUsers(req.user ? [req.user._id] : [])
            .then(function(users) {
                res.send({
                    users: users.map(function(u) {
                        return new PublicUser(u);
                    })
                })
            })
    });

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
     * Supply token to receive details regarding user votes on reviews.
     *
     * ## Errors (HTTP Status) ##
     *   token was invalid (401)
     *   user not found (404)
     *
     */
    router.get('/:username/reviews', function(req, res) {
        Users.getUser(req.params.username)
            .then(function(foundUser) {
                return Reviews.getReviews([foundUser._id], 0, (req.user ? req.user._id : undefined))
            })
            .then(function(publicReviews) {
                res.send({ reviews: publicReviews });
            })
            .catch(function(err) { Errors.sendErrorResponse(err, res) });
    });

    /**
     * Get all lists by a user.
     *
     * Returns HTTP status 200 if successful, with the lists in the response attribute "lists"
     *
     * ## Errors (HTTP Status) ##
     *   user can't be found (404)
     */
    router.get('/:username/lists', function(req, res) {
        MovieLists.getListsByAuthor(req.params.username)
            .then(function(lists) {
                res.send({lists: lists})
            })
            .catch(function(err) {
                Errors.sendErrorResponse(err, res);
            })
    });


    /**
     * Update user account details such as username, password or email.
     *
     * Returns HTTP status 200 if successful, with the updates information in the response body.
     *
     * Accepted body attributes:
     *   email
     *   username - 3-50 characters
     *   password - 6-50 characters
     *
     * ## Errors (HTTP Status) ##
     *   session token was not supplied (400)
     *   none of the expected attributes were supplied (400)
     *   username, password or email was malformed (400)
     *   session token was invalid (401)
     *   email or username was already registered to another user (409)
     *   username was malformed (420)
     *   email was malformed (421)
     *   password was malformed (422)
     *
     */
    router.put('/me', function(req, res) {
        if (!req.user || !req.body || (!req.body.email && !req.body.username && !req.body.password)) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            Users.updateUser(req.user, req.body)
                .then(function(savedUser) {
                    res.send(savedUser);
                })
                .catch(function(err) {
                    Errors.sendErrorResponse(err, res);
                })
        }
    });

    return router;

};
