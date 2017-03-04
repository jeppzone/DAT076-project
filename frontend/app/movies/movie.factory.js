'use strict';

angular.module('moviez.movie-factory', [])

.factory('MovieFactory', MovieFactory);

MovieFactory.$inject = ['ApiBase', '$http', 'TmdbFactory'];

function MovieFactory(ApiBase, $http, TmdbFactory) {
  var service = {
    getPopularMovies: getPopularMovies,
    getLatestReleases: getLatestReleases,
    searchMovie: searchMovie,
    getMovieById: getMovieById
  };

  return service;

  function getPopularMovies(page) {
    var data = 'movie?sort_by=popularity.desc&page=' + page;
    return TmdbFactory.executeTMDbRequest('discover', data, true);
  }

  function getLatestReleases() {
    var data = 'movie?primary_release_date.gte=2017-03-01&primary_release_date'+
    '.lte=2017-03-04';
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
