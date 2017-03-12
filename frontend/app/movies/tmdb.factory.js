'use strict';
/**
Module containing the tmdb-factory, which is repsonsible for executing requests to the
external API TMDb.
**/
angular.module('moviez.tmdb-factory', [])

.factory('TmdbFactory', TmdbFactory);

TmdbFactory.$inject = ['TMDbApiBase', 'ApiKey', '$http'];

function TmdbFactory(TMDbApiBase, ApiKey, $http) {
  var service = {
    executeTMDbRequest: executeTMBbRequest
  };

  return service;

  /**
  Function that sends requests to the TMDb API
  *@param type - Type of request, either 'search', 'discover' or 'find'
  *@param data - The query parameters of the requests
  *@param multipleQueryParameters - Boolean telling if the requests contains other
  query parameters than the API-key, to know if to use '?' or '&' for the api key
  **/
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
