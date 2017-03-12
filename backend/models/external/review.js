/**
 * Created by Oskar Jönefors on 2/26/17.
 *
 * External representation of a review. If a recipient id is supplied, the representation will reflect any vote
 * made by that user on the review.
 *
 */

var PublicUser = require('./user');

module.exports = function(internalReview, recipientId) {
    this.id = internalReview._id;
    this.author = new PublicUser(internalReview.author);
    this.date = internalReview.date;
    if (internalReview.score) {
        this.score = internalReview.score;
    }
    if (internalReview.text) {
        this.text = internalReview.text;
    }
    if (recipientId) {
        if (internalReview.upvotes.some(function(voterId) {
                return voterId.equals(recipientId);
            })) {
            this.myVote = 1;
        } else if (internalReview.downvotes.some(function(voterId) {
                return voterId.equals(recipientId);
            })) {
            this.myVote = -1;
        } else {
            this.myVote = 0;
        }
    }

    this.voteScore = internalReview.voteScore;

};