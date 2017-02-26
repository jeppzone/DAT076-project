/**
 * Created by Oskar Jönefors on 2/26/17.
 */

var PublicUser = require('./user');

module.exports = function(internalReview) {
    this.id = internalReview._id;
    this.author = new PublicUser(internalReview.author);
    this.date = internalReview.date;
    if (internalReview.score) {
        this.score = internalReview.score;
    }
    if (internalReview.text) {
        this.text = internalReview.text;
    }

};