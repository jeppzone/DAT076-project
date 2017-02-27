'use strict';

angular.module('moviez.tmdb-factory', [])

.factory('TmdbFactory', TmdbFactory);

TmdbFactory.$inject = ['TMDbApiBase', 'ApiKey', '$http'];

function TmdbFactory(TMDbApiBase, ApiKey, $http) {
  var service = {
    executeTMDbRequest: executeTMBbRequest
  };

  return service;

  function executeTMBbRequest(type, data, multipleQueryParameters){
    var url = '';
    if(multipleQueryParameters){
      url = TMDbApiBase + type + '/' + data + '&' + ApiKey;
    }else{
      url = TMDbApiBase + data + '?' +ApiKey;
    }
    return $http.get(url);
  }
}
