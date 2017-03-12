'use strict';
/**
Module containing the movie-factory, which is responsible for all communication
to the backend regarding movies. It also works as a wrapper to the tmdb-factory
**/
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
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    var data = 'movie?primary_release_date.gte=' + getDateAsString(yesterday) + '&primary_release_date'+
    '.lte=' + getDateAsString(today);
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

  function getDateAsString(date){
    var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1: '0' + (date.getMonth() + 1);
    var year = date.getFullYear();

    return year.toString() + '-' + month.toString() + '-' + day.toString();
  }
}
