
var Cfg = require('../configuration');
var Errors = require('../errors');
var Status = require('http-status-codes');

var Users = require('../middleware/users');

module.exports = function(express) {

    var router = express.Router();


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

    return router;
};
