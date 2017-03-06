/**
 * Created by Oskar Jönefors on 3/6/17.
 */

var PublicMovie = require('./movie');
var PublicUser = require('./user');

module.exports = function(internalList) {
    this.id = internalList._id;
    this.author = new PublicUser(internalList.author);
    this.title = internalList.title;
    this.description = internalList.description;
    this.date = internalList.date;
    this.movies = internalList.movies.map(function(mov) {
        return new PublicMovie(mov);
    });
};