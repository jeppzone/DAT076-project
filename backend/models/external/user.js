/**
 * Created by Oskar Jönefors on 2/22/17.
 */

module.exports = function(internalUser) {
    return {
        id: internalUser._id,
        username: internalUser.username
    };
};