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

SearchController.$inject = ['SearchFactory', '$state', '$scope'];
function SearchController(SearchFactory, $state, $scope){
  $scope.searchString = '';
  $scope.$watch('searchString',
    (newValue, oldValue) => {
      SearchFactory.search(newValue);
      $state.go('menu.movies');
  });
}
