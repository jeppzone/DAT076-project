/**
 * Created by Oskar Jönefors on 2017-03-01.
 */

var Cfg = require('../../configuration');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var MovieSchema = new mongoose.Schema({
    tmdbId: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    releaseDate: { type: String, required: true },
    posterPath: String,
    lastActivity: { type: Date, default: Date.now },
    tmdbHash: { type: String, required: true } // Hash of the reply from TMDB, used to check if movie details have changed and need to be updated
});

module.exports = mongoose.model('Movie', MovieSchema);