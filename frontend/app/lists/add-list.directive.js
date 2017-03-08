'use strict';

angular.module('moviez.add-list', [])

.directive('addList', AddList)
.controller('AddListController', AddListController);

function AddList(){
  var directive = {
    restrict: 'E',
    templateUrl: 'lists/add-list-modal.view.html',
    controller: 'AddListController',
    controllerAs: 'vm'
  }

  return directive;
}

AddListController.$inject = ['$scope', 'MovieFactory'];
function AddListController($scope, MovieFactory){
  var vm = this;
  vm.movies = [];
  vm.list = [];
  vm.posterBase = 'http://image.tmdb.org/t/p/w92b'
  vm.models = {
    selected: null,
    lists: {'movies': vm.movies, "list": vm.list}
  };

  $scope.$watch('searchString',
    (newValue, oldValue) => {
  });
}
