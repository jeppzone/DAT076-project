'use strict';

angular.module('moviez.add-list', [])

.directive('addList', AddList)
.controller('AddListController', AddListController);

function AddList(){
  var directive = {
    restrict: 'E',
    templateUrl: 'lists/add-list.view.html',
    controller: 'AddListController',
    controllerAs: 'vm'
  }

  return directive;
}

AddListController.$inject = ['$scope'];
function AddListController($scope){
  console.log('In controller');
}
