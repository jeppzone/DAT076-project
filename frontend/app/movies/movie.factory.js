'use strict';

angular.module('moviez.movie-factory', [])

.factory('MovieFactory', MovieFactory);

MovieFactory.$inject = ['ApiBase', '$http'];

function MovieFactory(ApiBase, $http) {
  var TMDbApiBase = 'http://api.themoviedb.org/3/'
  var apiKey = '&api_key=f2975c7499d3ec3abb0aef5401787eb2'
  var service = {
    getPopularMovies: getPopularMovies
  };

  return service;

  function getPopularMovies(movie) {
    var data = 'movie?sort_by=popularity.desc'
    return executeTMBbRequest('discover', data);
  }

  function executeTMBbRequest(type, data){
    var url = TMDbApiBase + type + '/' + data + apiKey;
    return $http.get(url);
  }
}
