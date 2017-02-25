'use strict';

angular.module('moviez.search-factory', [])

.factory('SearchFactory', SearchFactory);

SearchFactory.$inject = ['ApiBase', '$http'];

function SearchFactory(ApiBase, $http) {
  var service = {
    search: search,
    searchString: ''
  };

  return service;

  function search(searchString) {
    console.log(searchString);
    service.searchString = searchString;
  }
}
