'use strict';

angular.module('moviez.search-factory', [])

.factory('SearchFactory', SearchFactory);

SearchFactory.$inject = ['ApiBase', '$http'];

function SearchFactory(ApiBase, $http) {
  var service = {
    search: search,
    searchType: '',
    searchString: '',
    searchResult: []
  };

  return service;

  function search(searchString, searchType) {
    service.searchString = searchString;
    service.searchType = searchType;
  }
}
