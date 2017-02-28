
var Cfg = require('../configuration');
var Errors = require('../errors');
var Status = require('http-status-codes');
var TokenVerification = require('../middleware/tokens').tokenVerification;

var Users = require('../middleware/users');

var PublicMe = require('../models/external/me');

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

    return router;
};
