/**
 * Created by Oskar Jönefors on 3/6/17.
 */
var Cfg = require('../../configuration');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var MovieListSchema = new mongoose.Schema({
    author: { type: ObjectId, ref: 'User', required: true },
    title: { type: String, required: true,
        minlength: Cfg.MOVIE_LIST_TITLE_MIN_LENGTH, maxlength: Cfg.MOVIE_LIST_TITLE_MAX_LENGTH },
    description: { type: String, default: '', maxlength: Cfg.MOVIE_LIST_DESCRIPTION_MAX_LENGTH },
    date: { type: Date, default: Date.now },
    movies: { type: [{type: ObjectId, ref: 'Movie'}], required: true }
});

module.exports = mongoose.model('MovieList', MovieListSchema);