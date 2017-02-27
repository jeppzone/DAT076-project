'use strict';

angular.module('moviez.movie-factory', [])

.factory('MovieFactory', MovieFactory);

MovieFactory.$inject = ['ApiBase', '$http', 'TmdbFactory'];

function MovieFactory(ApiBase, $http, TmdbFactory) {
  var service = {
    getPopularMovies: getPopularMovies,
    searchMovie: searchMovie,
    getMovieById: getMovieById
  };

  return service;

  function getPopularMovies(movie) {
    var data = 'movie?sort_by=popularity.desc'
    return TmdbFactory.executeTMDbRequest('discover', data, true);
  }

  function searchMovie(searchString) {
    var data = 'movie?query='+searchString;
    return TmdbFactory.executeTMDbRequest('search', data, true);
  }

  function getMovieById(id){
    var data='movie/' + id;
    return TmdbFactory.executeTMDbRequest('', data, false);
  }
}
