/**
 * Created by Oskar Jönefors on 2/22/17.
 *
 * Error constants. For now they only consist of HTTP Statuses, but could be expanded upon to have messages and
 * additional data.
 *
 */

var Status = require('http-status-codes');

module.exports = {
    BAD_REQUEST: Status.BAD_REQUEST,
    VALIDATION_ERROR: Status.BAD_REQUEST,
    NOT_FOUND: Status.NOT_FOUND,
    FORBIDDEN: Status.FORBIDDEN,
    USERNAME_MALFORMED: 420,
    EMAIL_MALFORMED: 421,
    PASSWORD_MALFORMED: 422,
    COLLISION: Status.CONFLICT,
    TOKEN_INVALID: Status.UNAUTHORIZED,
    LOGIN_INVALID: Status.UNAUTHORIZED,
    UNAUTHORIZED: Status.UNAUTHORIZED,
    UNKNOWN_ERROR: 500,

    /**
     * Send the given error in the given response.
     * @param err
     * @param res
     */
    sendErrorResponse: function(err, res) {
        console.log(err);
        if (typeof err === 'number') { // We know what went wrong since we threw this error.
            res.status(err).send();
        } else { // Something else happened, so send a status 500.
            res.status(this.UNKNOWN_ERROR).send();
        }
    }
};
