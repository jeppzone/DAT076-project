'use strict';

angular.module('moviez.list', [])

.directive('list', List)
.controller('ListController', ListController);

function List() {
  var directive = {
    restrict: 'E',
    templateUrl: 'lists/list.view.html',
    scope: {
      list: '='
    },
    controller: 'ListController',
    controllerAs: 'vm'
  };

  return directive;
}

ListController.$inject = ['MovieFactory'];
function ListController(MovieFactory) {
  var vm = this;
  vm.movies = [];
  MovieFactory.getPopularMovies(1).then((result) => {
    vm.movies = result.data.results;
  })

}
