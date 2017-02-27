'use strict';

angular.module('moviez.tmdb-factory', [])

.factory('TmdbFactory', TmdbFactory);

TmdbFactory.$inject = ['TMDbApiBase', 'ApiKey', '$http'];

function TmdbFactory(TMDbApiBase, ApiKey, $http) {
  var service = {
    executeTMDbRequest: executeTMBbRequest
  };

  return service;

  function executeTMBbRequest(type, data){
    var url = TMDbApiBase + type + '/' + data + ApiKey;
    return $http.get(url);
  }
}
