/**
 * Created by Oskar Jönefors on 2017-03-01.
 */


module.exports = {
    isValidObjectId: isValidObjectId
};

function isValidObjectId(id) {
    var objectIdRegEx = /^[0-9a-fA-F]{24}$/;
    if (typeof id !== 'string') {
        id = id + '';
    }
    return id && id.match(objectIdRegEx);
}