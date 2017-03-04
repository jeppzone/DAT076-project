'use strict';

angular.module('moviez.users', [])

.config(usersConfig)
.controller('UsersController', UsersController);

usersConfig.$inject = ['$stateProvider'];
function usersConfig($stateProvider){
  $stateProvider.state('menu.users', {
    resolve: {
      users: function(UserFactory){
        return UserFactory.getAllUsers();
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
  vm.users = users.data.users;
  console.log(vm.users);
}
