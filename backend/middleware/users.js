/**
 * Created by Oskar Jönefors on 2/22/17.
 */

var Cfg = require('../configuration');
var Errors = require('../errors');
var User = require('../models/internal/user');

module.exports = {
    getUser: getUser,
    login: login,
    register: register,
    search: search,
    getFollowedUsers: getFollowedUsers,
    followUser: followUser,
    unfollowUser: unfollowUser,
    updateUser: updateUser,
    getAllUsers: getAllUsers
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
                            return user;
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
        });
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
            return foundUser;
        })

}

/**
 * Update the user with the given user data
 * @param user
 * @param userData - should contain any of the attributes email, password or username
 */
function updateUser(user, userData) {
    user.email = userData.email ? userData.email : user.email;
    user.username = userData.username ? userData.username.trim() : user.username;
    user.usernameLower = user.username.toLowerCase();
    user.password = userData.password ? userData.password : user.password;

    return user.save()
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
}

function search(searchString) {

    var qry = '^' + searchString;
    return User.find({ usernameLower: new RegExp(qry, "i") })
        .limit(Cfg.SEARCH_MIN_LENGTH)

}

function getFollowedUsers(user) {
    return User.findById(user._id).populate('following')
        .then(function(populatedUser) {
            return populatedUser.following;
        });
}

function followUser(user, usernameToFollow) {
    return getUser(usernameToFollow)
        .then(function(userToFollow) {
            if (user.following.indexOf(userToFollow._id) < 0) {
                user.following.push(userToFollow._id);
            }
            return user.save();
        })
}

function unfollowUser(user, usernameToUnfollow) {
    return getUser(usernameToUnfollow)
        .then(function(userToUnfollow) {
            user.following = user.following.filter(function(u) {
                return !u.equals(userToUnfollow._id);
            });
            return user.save();
        })
}

/**
 * Get all users, with optional exceptions.
 * @param omittedIds - id:s of users to omit from results.
 * @returns {*}
 */
function getAllUsers(omittedIds) {

    omittedIds = omittedIds && omittedIds.length ? omittedIds : [];

    return User.find({ _id: { $nin: omittedIds }});
}