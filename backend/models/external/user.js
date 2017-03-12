/**
 * Created by Oskar Jönefors on 2/22/17.
 *
 * External representation of a user (other than the personal user).
 *
 */

module.exports = function(internalUser) {
    return {
        username: internalUser.username
    };
};