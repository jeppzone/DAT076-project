/**
 * Created by Oskar Jönefors on 2017-03-01.
 */

var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    tmdbId: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    releaseDate: String,
    posterPath: String,
    lastActivity: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', MovieSchema);