'use strict';

angular.module('moviez.search', [])

.directive('search', Search)
.controller('SearchController', SearchController);

function Search(){
  var directive = {
    restrict: 'E',
    templateUrl: 'menu/search/search.view.html',
    controller: 'SearchController',
    controllerAs: 'vm'
  };

  return directive;
}

SearchController.$inject = ['SearchFactory', '$state', '$scope', 'MovieFactory'];
function SearchController(SearchFactory, $state, $scope, MovieFactory){
  $scope.searchString = '';
  $scope.searchType = 'Movies';
  SearchFactory.searchType = 'Movies';
  $scope.$watch('searchString',
    (newValue, oldValue) => {
      SearchFactory.search(newValue, $scope.searchType); //Set this here for testing purposes
      if(newValue) {
        if(SearchFactory.searchType === 'Movies') {
          MovieFactory.searchMovie(newValue).then((result) => {
            SearchFactory.searchResult = result.data.results;
          });
          $state.go('menu.movies');
        }else {
          $state.go('menu.users');
        }
      }
  });

  $scope.$watch('searchType',
  (newValue) => {
    SearchFactory.search($scope.searchString, newValue);
    if(newValue === 'Movies' && SearchFactory.searchString){
      MovieFactory.searchMovie(SearchFactory.searchString).then((result) => {
        SearchFactory.searchResult = result.data.results;
      });
      $state.go('menu.movies');
    }else if(newValue === 'Users' && SearchFactory.searchString){
      $state.go('menu.users');
    }
  });
}
