'use strict';
/**
Module containing the search factory, which is responsible for storing the current
search type (Users or Movies), the current search string and the lastest search results
**/
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
