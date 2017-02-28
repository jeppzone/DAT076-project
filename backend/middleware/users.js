/**
 * Created by Oskar Jönefors on 2/22/17.
 */

var Errors = require('../errors');
var User = require('../models/internal/user');
var PublicMe = require('../models/external/me');
var PublicUser = require('../models/external/user');

var Tokens = require('./tokens');

module.exports = {
    getUser: getUser,
    getUserProfile: getUserProfile,
    login: login,
    register: register
};

/**
 * Login a user by supplying e-mail or username and password
 * @param userIdentifier - e-mail or username
 * @param password
 * @returns {Promise|*} - An external representation of the user together with a session token
 */
function login(userIdentifier, password) {
    return User.findOne({
        $or: [
            {usernameLower: userIdentifier.toLowerCase().trim()},
            {email: userIdentifier.toLowerCase().trim()}
        ]
    })
        .then(function(user) {
            if (user) {
                return user.comparePassword(password.trim())
                    .then(function(isMatch) {
                        if (isMatch) {
                            var pubUser = PublicMe(user);
                            pubUser.token = Tokens.signSessionToken(user);
                            return pubUser;
                        } else {
                            throw Errors.LOGIN_INVALID;
                        }
                    })
            } else {
                /* No user was found */
                throw Errors.NOT_FOUND;
            }
        })


}

/**
 * Register a user by supplying user data.
 * @param userData - Should have the attributes username, email and password
 * @returns {*} - A Promise with a public representation of the user, including a session token in the "token" attribute
 */
function register(userData) {

    var newUser = new User({
        usernameLower: userData.username.toLowerCase().trim(),
        username: userData.username.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password.trim()
    });

    return newUser.save()
        .catch(function (err) {
            //noinspection FallThroughInSwitchStatementJS
            switch (err.name) {
                case 'ValidationError':
                    if (err.errors.email) {
                        throw Errors.EMAIL_MALFORMED;
                    } else if (err.errors.username || err.errors.usernameLower) {
                        throw Errors.USERNAME_MALFORMED;
                    } else {
                        throw Errors.UNKNOWN_ERROR;
                    }
                case 'MongoError':
                    if (err.errmsg.indexOf('duplicate key error') >= 0) {
                        console.log("COLLISION");
                        throw Errors.COLLISION;
                    }
                default:
                    throw Errors.UNKNOWN_ERROR;
            }
        })
        .then(function(savedUser) {
            var pubUser = PublicMe(savedUser);
            pubUser.token = Tokens.signSessionToken(savedUser);
            return pubUser;
        })

}

/**
 * Get the user with the given username.
 * @param username
 * @returns {Promise|*} - The user, or an error if none found.
 */
function getUser(username) {
    return User.findOne({ usernameLower: username.toLowerCase().trim() })
        .then(function(foundUser) {
            if (!foundUser) {
                throw Errors.NOT_FOUND;
            }
            return new PublicUser(foundUser);
        })

}

/**
 * Return the public representation of the profile of the given user.
 * @param user
 * @returns {Promise}
 */
function getUserProfile(user) {
    return Promise.resolve(new PublicMe(user));
}