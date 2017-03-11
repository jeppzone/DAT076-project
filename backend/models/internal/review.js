/**
 * Created by Oskar Jönefors on 2/26/17.
 */

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var ReviewSchema = new mongoose.Schema({
    tmdbMovieId: { type: Number, index: true, required: true },
    movie: { type: ObjectId, ref: 'Movie', required: true },
    author: { type: ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    score: { type: Number, min: 1, max: 5 },
    text: { type: String },
    upvotes: [{ type: ObjectId, ref: 'User'} ],
    downvotes: [{ type: ObjectId, ref: 'User' }],
    voteScore: Number
});

ReviewSchema.index({ author: 1, tmdbMovieId: -1}, {unique: true });

ReviewSchema.pre('save', function(next) {
    var review = this;
    review.voteScore = review.upvotes.length - review.downvotes.length;
    next();
});

module.exports = mongoose.model('Review', ReviewSchema);