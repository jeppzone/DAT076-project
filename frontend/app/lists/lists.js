'use strict';

angular.module('moviez.lists', [])

.config(listsConfig)
.controller('ListsController', ListsController);

listsConfig.$inject = ['$stateProvider'];
function listsConfig($stateProvider) {
  $stateProvider.state('menu.lists', {
    url: '/lists',
    views: {
      'main':{
        templateUrl: '/lists/lists.view.html',
        controller: 'ListsController',
        controllerAs: 'vm'
      }
    }
  });
}

ListsController.$inject = [];
function ListsController() {
  var vm = this;
  vm.lists = [];

  for(var i = 0; i < 6; i++) {
    vm.lists[i] = 'List ' + i;
  }

}
