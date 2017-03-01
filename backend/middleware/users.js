/**
 * Created by Oskar Jönefors on 2/22/17.
 */

var Cfg = require('../configuration');
var Errors = require('../errors');
var User = require('../models/internal/user');
var Profile = require('../models/internal/profile');
var PublicMe = require('../models/external/me');
var PublicProfile = require('../models/external/profile');
var PublicUser = require('../models/external/user');

var Tokens = require('./tokens');

module.exports = {
    getUser: getUser,
    getUserProfile: getUserProfile,
    getUserAndProfile: getUserAndProfile,
    updateProfile: updateProfile,
    login: login,
    register: register,
    search: search,
    getFollowedUsers: getFollowedUsers,
    followUser: followUser,
    unfollowUser: unfollowUser
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
            var userProfile = new Profile({ owner: savedUser._id });

            return userProfile.save()
                .then(function(savedProfile) {
                    var pubUser = PublicMe(savedUser);
                    pubUser.token = Tokens.signSessionToken(savedUser);
                    return pubUser;
                });
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
            return foundUser;
        })

}

/**
 * Return the public representation of the profile of the given user.
 * @param user
 * @returns {Promise}
 */
function getUserProfile(user) {
    return getProfile(user._id)
        .then(function(foundProfile) {
            return new PublicProfile(foundProfile);
        });
}

function getUserAndProfile(username) {
    return User.findOne({ usernameLower: username.toLowerCase().trim() })
        .then(function(foundUser) {
            if (!foundUser) {
                throw Errors.NOT_FOUND;
            }
            return getUserProfile(foundUser)
                .then(function(foundProfile) {
                    return { user: new PublicUser(foundUser), profile: new PublicProfile(foundProfile) }
                })
        })
}

/**
 * Update the profile belonging to the given user with the given text.
 * @param user
 * @param text
 * @returns {Promise|*} The updated profile, or an error if the text had the wrong format.
 */
function updateProfile(user, text) {
    return Profile.findOne({ owner: user._id })
        .then(function(foundProfile) {
            foundProfile.text = text;
            foundProfile.lastActivity = Date.now();
            return foundProfile.save()
                .catch(function(err) {
                    throw Errors.UNKNOWN_ERROR;
                });
        })
        .then(function(savedProfile) {
            return { user: new PublicMe(user), profile: new PublicProfile(savedProfile) }
        })
}

/**
 * Get the profile belonging to the user with the given id.
 * @param userId
 * @returns {Promise|*}
 */
function getProfile(userId) {
    return Profile.findOne({ owner: userId })
        .then(function(foundProfile) {
            if (!foundProfile) {
                throw Errors.NOT_FOUND;
            }
            return foundProfile;
        });
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