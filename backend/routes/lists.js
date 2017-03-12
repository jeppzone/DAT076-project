/**
 * Created by Oskar Jönefors on 3/6/17.
 */
var Errors = require('../errors');
var Status = require('http-status-codes');
var Cfg = require('../configuration');
var MovieLists = require('../middleware/movie-lists');
var TokenVerification = require('../middleware/tokens').tokenVerification;

var PublicFullMovieList = require('../models/external/movie-list-full');
var PublicMovieListOverview = require('../models/external/movie-list-overview');

module.exports = function(express) {

    var router = express.Router();
    router.use(TokenVerification);

    router.get('/', function(req, res) {

        var sortQuery = {};
        if (req.query.sortby) {
            var sortOrder = req.query.sortorder && req.query.sortorder === 'desc' ? -1 : 1;
            sortQuery = req.query.sortby === 'date' ? { date: sortOrder } :
                (req.query.sortby === 'title' ? { title: sortOrder } : {});
        }

        MovieLists.getLists({}, sortQuery)
            .then(function(pubLists) {
                res.send({lists: pubLists})
            })
            .catch(function(err) {Errors.sendErrorResponse(err, res) })

    });

    /**
     * Get all lists by the users you are following.
     * Returns HTTP Status 201 if successful, together with the reviews in response body attribute "lists".
     *
     * ## Errors (HTTP Status) ##
     *   session token was missing (400)
     *   session token was invalid (401)
     *
     */
    router.get('/following', function(req, res) {
        if (!req.user) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            MovieLists.getLists({ author: {$in: req.user.following} }, { date: -1 })
                .then(function(lists) {
                    var pubLists = lists.map(function(ml) {
                        return new PublicMovieListOverview(ml);
                    });
                    res.send({lists: pubLists })
                })
                .catch(function(err) {Errors.sendErrorResponse(err, res)})
        }
    });

    /**
     * Get specific list. Returns the list populated with all movies.
     *
     * ## Errors (HTTP Status) ##
     *   List was not found (404)
     */
    router.get('/:listId', function(req, res) {
        MovieLists.getMovieList(req.params.listId)
            .then(function(movieList) {
                res.send(new PublicFullMovieList(movieList));
            })
            .catch(function(err) { Errors.sendErrorResponse(err, res) })
    });


    /**
     * Update movie list. Supply any or all of the following attributes in the request body.
     *   title - Title of list. Min 3 characters, Max 140 characters
     *   description - Description of lists. Max 3000 characters.
     *   movies - Array of TMDB ids for movies. Max 500 movies
     *
     * Any attributes not sent will be unchanged in the list.
     * Returns HTTP status 200 if successful
     *
     * ## Errors (HTTP Status) ##
     *   title was malformed (400)
     *   description was too long (400)
     *   movie list was too long (400)
     *   session token was missing (400)
     *   session token was invalid (401)
     *   the user did not own the list (401)
     *   one or more movies was not found (404)
     *
     */
    router.put('/:listId', function(req, res) {
        var user = req.user;
        var body = req.body;
        if (!user || !body ||
            body.title && body.title.trim().length < Cfg.MOVIE_LIST_TITLE_MIN_LENGTH ||
            body.title && body.title.trim().length > Cfg.MOVIE_LIST_TITLE_MAX_LENGTH ||
            body.description && body.description.trim().length > Cfg.MOVIE_LIST_DESCRIPTION_MAX_LENGTH ||
            body.movies && body.movies.length > Cfg.MOVIE_LIST_MAX_LENGTH
        ) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res)
        } else {
            MovieLists.editMovieList(req.params.listId,
                body.title ? body.title.trim() : undefined,
                body.description ? body.description.trim() : undefined, body.movies, user._id)
                .then(function(savedList) {
                    //Success
                    res.send()
                })
                .catch(function(err) {
                    Errors.sendErrorResponse(err, res);
                })
        }
    });


    /**
     * Create a new lists.
     * Takes the following body arguments:
     *   title - Title of list. Min 3 characters, Max 140 characters
     *   description (Optional) - Description of lists. Max 3000 characters.
     *   movies - Array of TMDB ids for movies. Max 500 movies
     *
     * Returns HTTP status 201 if successful, together with the list id in the response attribute "listId"
     *
     * ## Errors (HTTP Status) ##
     *   title was missing or malformed (400)
     *   description was too long (400)
     *   movie list was missing or too long (400)
     *   session token was missing (400)
     *   session token was invalid (401)
     *   one or more movies was not found (404)
     *
     */
    router.post('/', function(req, res) {
        var user = req.user;
        var body = req.body;
        if (!user || !body || !body.title ||
            body.title.trim().length < Cfg.MOVIE_LIST_TITLE_MIN_LENGTH ||
            body.title.trim().length > Cfg.MOVIE_LIST_TITLE_MAX_LENGTH ||
            (body.description && body.description.trim().length > Cfg.MOVIE_LIST_DESCRIPTION_MAX_LENGTH) ||
            !body.movies || !body.movies.length > Cfg.MOVIE_LIST_MAX_LENGTH
        ) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            MovieLists.createMovieList(body.title.trim(), body.description ? body.description.trim() : undefined,
                body.movies, user._id)
                .then(function(savedList) {
                    //success
                    res.status(Status.CREATED).send({ listId: savedList._id })
                })
                .catch(function(err) { Errors.sendErrorResponse(err, res) });
        }
    });

    /**
     * Delete a list. Returns HTTP Status 200 if successful.
     *
     * ## Errors (HTTP Status) ##
     *   session token was missing (400)
     *   session token was invalid (401)
     *   user did not own the list (401)
     *   list could not be found (404)
     *
     */
    router.delete('/:listId', function(req, res) {
        if (!req.user) {
            Errors.sendErrorResponse(Errors.BAD_REQUEST, res);
        } else {
            MovieLists.deleteMovieList(req.params.listId, req.user._id)
                .then(function() {
                    //Success
                    res.send();
                })
                .catch(function(err) {
                    Errors.sendErrorResponse(err, res);
                })
        }
    });

    return router;
};