'use strict';

angular.module('moviez.users', [])

.config(usersConfig)
.controller('UsersController', UsersController);

usersConfig.$inject = ['$stateProvider'];
function usersConfig($stateProvider){
  $stateProvider.state('menu.users', {
    resolve: {
      users: function(UserFactory){
        return UserFactory.searchUsers('testing'); //Change this to getAllUsers when available in backend
      }
    },
    url: '/users',
    views: {
      'main':{
        templateUrl: '/users/users.view.html',
        controller: 'UsersController',
        controllerAs: 'vm'
      }
    }
  });
}

UsersController.$inject = ['users'];
function UsersController(users) {
  var vm = this;
  vm.users = users.data;
  console.log(vm.users);
}
