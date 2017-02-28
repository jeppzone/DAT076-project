/**
 * Created by Oskar Jönefors on 2/22/17.
 */

var Status = require('http-status-codes');

module.exports = {
    BAD_REQUEST: Status.BAD_REQUEST,
    VALIDATION_ERROR: Status.BAD_REQUEST,
    NOT_FOUND: Status.NOT_FOUND,
    USERNAME_MALFORMED: 420,
    EMAIL_MALFORMED: 421,
    PASSWORD_MALFORMED: 422,
    COLLISION: Status.CONFLICT,
    TOKEN_INVALID: Status.UNAUTHORIZED,
    LOGIN_INVALID: Status.UNAUTHORIZED,
    UNAUTHORIZED: Status.UNAUTHORIZED,
    UNKNOWN_ERROR: 500,

    sendErrorResponse: function(err, res) {
        console.log(err);
        if (typeof err === 'number') {
            res.status(err).send();
        } else {
            res.status(this.UNKNOWN_ERROR).send();
        }
    }
};
