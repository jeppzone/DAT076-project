/**
 * Created by Oskar Jönefors on 2017-03-01.
 *
 * External representation of a movie.
 */

module.exports = function(movie) {
    this.id = movie.tmdbId;
    this.title = movie.title;
    if (movie.releaseDate) {
        this.year = movie.releaseDate.split('-')[0];
    }
    this.posterPath = movie.posterPath;
};