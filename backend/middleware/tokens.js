/**
 * Created by Oskar Jönefors on 2/22/17.
 */

var jwt = require('jsonwebtoken');
var Cfg = require('../configuration');
var Errors = require('../errors');
var Promise = require('bluebird');
var JwtVerifyAsync = Promise.promisify(jwt.verify, jwt);
var User = require('../models/internal/user');


module.exports = {
    signSessionToken: signSessionToken,
    decodeToken: decodeToken,
    tokenVerification: tokenVerification
};

function signSessionToken(user) {
    return jwt.sign({
            user: user._id
        },
        Cfg.TOKEN_SECRET, {
            expiresIn: Cfg.TOKEN_EXPIRATION_TIME
        });
}

/**
 * Decode the supplied token and return it
 * @param token - A session token
 * @returns {Promise} The decoded session token
 */
function decodeToken(token) {
    return JwtVerifyAsync(token, Cfg.TOKEN_SECRET)
        .then(function(decodedToken) {
            if (!decodedToken.user) {
                throw Errors.TOKEN_INVALID;
            }
            return decodedToken;
        })
        .catch(function(err) {
            throw Errors.TOKEN_INVALID;
        })
}

function tokenVerification(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['authorization'];

    if (!token) {
        next();
    } else {
        decodeToken(token)
            .then(function(decodedToken) {
                return User.findById(decodedToken.user)
            })
            .then(function(user){
                req.user = user;
                next();
            })
            .catch(function(err){
                Errors.sendErrorResponse(Errors.TOKEN_INVALID, res);
            });
    }
}