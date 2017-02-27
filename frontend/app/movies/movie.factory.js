'use strict';

angular.module('moviez.movie-factory', [])

.factory('MovieFactory', MovieFactory);

MovieFactory.$inject = ['ApiBase', '$http', 'TmdbFactory'];

function MovieFactory(ApiBase, $http, TmdbFactory) {
  var service = {
    getPopularMovies: getPopularMovies,
    searchMovie: searchMovie
  };

  return service;

  function getPopularMovies(movie) {
    var data = 'movie?sort_by=popularity.desc'
    return TmdbFactory.executeTMDbRequest('discover', data);
  }

  function searchMovie(searchString) {
    var data = 'movie?query='+searchString;
    return TmdbFactory.executeTMDbRequest('search', data);
  }
}
