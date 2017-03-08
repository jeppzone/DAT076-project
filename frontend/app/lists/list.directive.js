'use strict';

angular.module('moviez.list', [])

.directive('list', List)
.controller('ListController', ListController);

function List() {
  var directive = {
    restrict: 'E',
    templateUrl: 'lists/list.view.html',
    scope: {
      listId: '='
    },
    controller: 'ListController',
    controllerAs: 'vm'
  };

  return directive;
}

ListController.$inject = ['$scope', 'ListFactory'];
function ListController($scope, ListFactory) {
  var vm = this;
  ListFactory.getListById($scope.listId).then((result) => {
    console.log(result);
    vm.movies = result.data.movies;
  });

}
