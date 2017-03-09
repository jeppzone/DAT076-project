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

ListController.$inject = ['$scope', 'ListFactory', 'UserFactory', 'AddListModal'];
function ListController($scope, ListFactory, UserFactory, AddListModal) {
  var vm = this;
  vm.deleteList = deleteList;
  vm.openListModal = openListModal;
  vm.loggedInUser = UserFactory.userInfo;
  ListFactory.getListById($scope.list.id).then((result) => {
    vm.detailedList = result.data;
  });

  function deleteList() {
    ListFactory.deleteList($scope.list.id).then((result) => {
      $scope.$parent.vm.lists.splice($scope.$parent.vm.lists.indexOf($scope.list), 1);
    });
  }

  function openListModal() {
    AddListModal.showModal(vm.detailedList.movies, vm.detailedList.title).result.then((result) => {
      ListFactory.getListById(result.data.listId).then((result) => {
        var index = $scope.$parent.vm.lists.indexOf($scope.list);
        $scope.$parent.vm.lists[index] = result.data;
      });
    });
  }

}
