/**
 * Created by Oskar Jönefors on 3/6/17.
 *
 * External representation of a movie list. Meant to be used in overviews where the actual list content
 * is not shown, but merely the name, author and description.
 *
 */

var PublicUser = require('./user');

module.exports = function(internalList) {
    this.id = internalList._id;
    this.author = new PublicUser(internalList.author);
    this.title = internalList.title;
    this.description = internalList.description;
    this.date = internalList.date;
};