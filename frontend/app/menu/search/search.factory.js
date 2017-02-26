'use strict';

angular.module('moviez.search-factory', [])

.factory('SearchFactory', SearchFactory);

SearchFactory.$inject = ['ApiBase', '$http'];

function SearchFactory(ApiBase, $http) {
  var service = {
    search: search,
    searchString: '',
    searchResult: []
  };

  return service;

  function search(searchString) {
    console.log(searchString);
    service.searchString = searchString;
    service.searchResult = [searchString]; //Only for testing purposes;
    /* TODO Call to API */
  }
}
