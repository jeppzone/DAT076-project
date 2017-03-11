/**
 * Created by Oskar Jönefors on 3/6/17.
 */

var Promise = require('bluebird');
var Errors = require('../errors');
var MovieList = require('../models/internal/movie-list');
var Movies = require('./movies');
var Users = require('./users');
var PublicFullMovieList = require('../models/external/movie-list-full');
var PublicMovieListOverview = require('../models/external/movie-list-overview');

module.exports = {
    createMovieList: createMovieList,
    editMovieList: editMovieList,
    deleteMovieList: deleteMovieList,
    getMovieList: getMovieList,
    getListsByAuthor: getListsByAuthor,
    getLists: getLists
};

function createMovieList(title, description, movieTmdbIds, authorId) {
    return Promise.all(movieTmdbIds.map(Movies.getMovie))
        .then(function(movies) {
            var newList = new MovieList({
                author: authorId,
                title: title,
                description: description ? description : '',
                movies: movies.map(function(m) { return m._id })
            });
            return newList.save();
        });
}

function editMovieList(listId, title, description, movieTmdbIds, authorId) {
    return MovieList.findById(listId)
        .then(function(foundList) {
            if (!foundList) {
                throw Errors.NOT_FOUND;
            } else if (!foundList.author.equals(authorId)) {
                throw Errors.FORBIDDEN;
            }
            foundList.title = title ? title : foundList.title;
            foundList.description = description ? description : foundList.description;
            foundList.date = Date.now();
            if (movieTmdbIds) {
                return Promise.all(movieTmdbIds.map(Movies.getMovie))
                    .then(function(movies) {
                        foundList.movies = movies.map(function(m) { return m._id });
                        return foundList.save();
                    })
            } else {
                return foundList.save();
            }
        })
}

function deleteMovieList(listId, authorId) {
    return MovieList.findById(listId)
        .then(function(foundList) {
            if (!foundList) {
                throw Errors.NOT_FOUND;
            } else if (!foundList.author.equals(authorId)) {
                throw Errors.FORBIDDEN;
            }
            return foundList.remove();
        })
}

function getMovieList(listId) {
    return MovieList.findById(listId)
        .populate('author movies')
        .then(function(populatedList) {
            if (!populatedList) {
                throw Errors.NOT_FOUND;
            }
            return new PublicFullMovieList(populatedList);
        })
}

function getListsByAuthor(username) {
    return Users.getUser(username)
        .then(function(foundUser) {
            return MovieList.find({author: foundUser._id})
                .populate('author')
                .then(function(populatedMovieLists) {
                    return populatedMovieLists.map(function(ml) {
                        return new PublicMovieListOverview(ml);
                    })
                })
        })
}

function getLists(searchQuery, sortQuery, limit) {
    return MovieList.find(searchQuery ? searchQuery : {})
        .sort(sortQuery ? sortQuery : {})
        .limit(limit ? limit : 0)
        .populate('author')
        .then(function(movieLists) {
            return movieLists.map(function(ml) {
                return new PublicMovieListOverview(ml);
            })
        })
}