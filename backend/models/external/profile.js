/**
 * Created by Oskar Jönefors on 2017-02-28.
 *
 * External representation of a user's profile text.
 *
 */

module.exports = function(profile) {
    return {
        text: profile.text,
        lastActivity: profile.lastActivity
    }
};