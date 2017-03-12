
var Cfg = require('../configuration');
var Errors = require('../errors');
var Status = require('http-status-codes');
var TokenVerification = require('../middleware/tokens').tokenVerification;

var Users = require('../middleware/users');

var PublicMe = require('../models/external/me');
var PublicUser = require('../models/external/user');

module.exports = function(express) {

    var router = express.Router();
    router.use(TokenVerification);


    /**
     * Login a user using e-mail and password credentials.
     * Takes a request with submitted username or e-mail address in the body field user,
     * and password in the body field password.
     *
     * Returns HTTP Status 200 if successful.
     *
     * ## Errors (HTTP Status) ##
     *   wrong password (401)
     *   user not registered (404)
     *   missing fields (400)
     *
     */
    router.post('/login', function(req, res) {
        var body = req.body;
        if (!body.user || !body.password) {
            res.status(Errors.BAD_REQUEST).send();
        } else {
            Users.login(body.user, body.password)
                .then(function(publicUser) {
                    res.send(publicUser);
                })
                .catch(function(err) {
                    Errors.sendErrorResponse(err, res);
                })
        }
    });

    /**
     * Register a new user using e-mail and password credentials.
     * Takes a request with submitted username, email address and password in the body fields
     * username, email and password.
     *
     * Returns HTTP Status 201 if successful.
     *
     * ## Errors (HTTP Status) ##
     *   required fields were missing (400)
     *   username or email address is already registered (409)
     *   username was malformed (420)
     *   email address was malformed (421)
     *   password was too short or long (422)
     *
     */
    router.post('/register', function(req, res) {

        var body = req.body;
        if (!body.username || !body.email || !body.password) {
            res.status(Errors.BAD_REQUEST).send();
        } else if (body.password.trim().length < Cfg.PASSWORD_MIN_LENGTH || body.password.trim().length > Cfg.PASSWORD_MAX_LENGTH) {
            res.status(Errors.PASSWORD_MALFORMED).send();
        } else {
            Users.register(body)
                .then(function(publicUser) {
                    res.status(Status.CREATED).send(publicUser)
                })
                .catch(function(err) {
                    Errors.sendErrorResponse(err, res);
                })
        }

    });

    /**
     * Get the profile of the user belonging to the token supplied in the request "authorization" header.
     *
     * Returns HTTP Status 200 if successful, together with the user profile information.
     *
     * ## Errors (HTTP Status) ##
     *   token was not supplied (400)
     *   token was invalid (401)
     *
     */
    router.get('/profile', function(req, res) {

        if (!req.user) { //Token was not supplied
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            Users.getUserProfile(req.user)
                .then(function(pubProfile) {

                    res.send({user: new PublicMe(req.user), profile: pubProfile});
                })
                .catch(function(err) { Errors.sendErrorResponse(err, res); });
        }

    });

    /**
     * Update the profile of the user issued the token supplied in the request "authorization" header.
     * Accepts the body attribute "text" with a max length of 3000 characters.
     *
     * Returns HTTP Status 200 if successful, together with the user and the updated user profile.
     *
     * ## Errors (HTTP Status) ##
     *   token or profile text was not supplied, or text was too long (400)
     *   token was invalid (401)
     *
     */
    router.put('/profile', function(req, res) {

        if (!req.user || !req.body || !req.body.text || typeof req.body.text !== 'string' ||
            req.body.text.length > Cfg.PROFILE_MAX_LENGTH) {

            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            Users.updateProfile(req.user, req.body.text)
                .then(function(pubUserAndProfile) {
                    res.send(pubUserAndProfile);
                })
                .catch(function(err) { Errors.sendErrorResponse(err, res) })
        }

    });

    /**
     * Get all followed users.
     *
     * Returns HTTP Status 200 if successful.
     *
     * ## Errors (HTTP Status) ##
     *   token was missing (400)
     *   token was invalid (401)
     *
     */
    router.get('/following', function(req, res) {
        if (!req.user) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            Users.getFollowedUsers(req.user)
                .then(function(followedUsers) {
                    res.send({ following: followedUsers.map(function(u) { return new PublicUser(u) }) })
                })
                .catch(function(err) { Errors.sendErrorResponse(err, res) })
        }
    });

    /**
     * Add user to follow. Accepts a username in query parameter "user"
     *
     * Returns HTTP Status 200 if successful.
     *
     * ## Errors (HTTP Status) ##
     *   query parameter or token was missing (400)
     *   token was invalid (401)
     *   user tried to add itself (403)
     *   user could not be found (404)
     *
     */
    router.put('/following', function(req, res) {

        if (!req.user || !req.query.user) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else if (req.query.user.toLowerCase().trim() === req.user.usernameLower) {
            Errors.sendErrorResponse(Errors.FORBIDDEN, res);
        } else {
            Users.followUser(req.user, req.query.user)
                .then(function() {
                    // Success
                    res.send();
                })
                .catch(function(err) { Errors.sendErrorResponse(err, res) });
        }

    });

    /**
     * Remove followed user. Accepts a username in query parameter "user"
     *
     * Returns HTTP Status 200 if successful.
     *
     * ## Errors (HTTP Status) ##
     *   query parameter or token was missing (400)
     *   token was invalid (401)
     *   user tried to add itself (403)
     *   user could not be found (404)
     *
     */
    router.delete('/following', function(req, res) {

        if (!req.user || !req.query.user) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            Users.unfollowUser(req.user, req.query.user)
                .then(function() {
                    // Success
                    res.send();
                })
                .catch(function(err) { Errors.sendErrorResponse(err, res) });
        }

    });

    return router;
};
