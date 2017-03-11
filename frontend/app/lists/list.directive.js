'use strict';

/** Module containing the directive that is responsible for displaying a single list
    It takes one scope property:
*   @property list - The list that should be displayed
**/
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

  /* Send a request to the backend to delete the given list and then remove
  it from the parent container
  */
  function deleteList() {
    ListFactory.deleteList($scope.list.id).then(() => {
      $scope.$parent.vm.lists.splice($scope.$parent.vm.lists.indexOf($scope.list), 1);
    });
  }

  function openListModal() {
    AddListModal.showModal(vm.detailedList.movies, vm.detailedList.title, $scope.list.id, true).result.then(() => {
      ListFactory.getListById($scope.list.id).then((result) => {
        var index = $scope.$parent.vm.lists.indexOf($scope.list);
        $scope.$parent.vm.lists[index] = result.data;
      });
    });
  }

}
