/**
 * Created by Oskar Jönefors on 2017-03-12.
 */

var Errors = require('../errors');

var Profile = require('../models/internal/profile');

module.exports = {
    createProfile: createProfile,
    getProfile: getProfile,
    updateProfile: updateProfile
};

/**
 * Create a new profile owned by the given user id.
 * @param userId
 * @returns {*}
 */
function createProfile(userId) {
    return new Profile({ owner: userId }).save();
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

/**
 * Update the profile belonging to the given user with the given text.
 * @param user
 * @param text
 * @returns {Promise|*} The updated profile, or an error if the text had the wrong format.
 */
function updateProfile(user, text) {
    return Profile.findOne({ owner: user._id })
        .then(function(foundProfile) {
            if (!foundProfile) {
                throw Errors.NOT_FOUND;
            }
            foundProfile.text = text;
            foundProfile.lastActivity = Date.now();
            return foundProfile.save()
                .catch(function(err) {
                    throw Errors.UNKNOWN_ERROR;
                });
        });
}