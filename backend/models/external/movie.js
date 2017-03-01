/**
 * Created by Oskar Jönefors on 2017-03-01.
 */

module.exports = function(movie) {
    return {
        id: movie.tmdbId,
        title: movie.title,
        year: movie.releaseDate.split('-')[0],
        posterPath: movie.posterPath
    }
};