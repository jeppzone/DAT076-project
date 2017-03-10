'use strict';

angular.module('moviez.lists', [])

.config(listsConfig)
.controller('ListsController', ListsController);

listsConfig.$inject = ['$stateProvider'];
function listsConfig($stateProvider) {
  $stateProvider.state('menu.lists', {
    resolve: {
      lists: function(ListFactory) {
        return ListFactory.getAllLists('date', 'desc');
      }
    },
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

ListsController.$inject = ['lists', 'AddListModal', 'ListFactory'];
function ListsController(lists, AddListModal, ListFactory) {
  var vm = this;
  vm.filter = filter;
  vm.showListModal = showListModal;
  vm.lists = lists.data.lists;
  vm.listsFromFollowedUsers = [];
  vm.showAllLists = true;
  ListFactory.getListsFromFollowedUsers().then((result) => {
    vm.listsFromFollowedUsers = result.data.lists;
  });

  function showListModal() {
    AddListModal.showModal().result.then((result) => {
      ListFactory.getListById(result.data.listId).then((result) => {
        vm.lists.unshift(result.data);
      });
    });
  }

  function filter() {
    if(vm.showAllLists){
      vm.lists = lists.data.lists;
    }else{
      vm.lists = vm.listsFromFollowedUsers;
    }
  }
}
