'use strict';

angular.module('moviez.users', [])

.config(usersConfig)
.controller('UsersController', UsersController);

usersConfig.$inject = ['$stateProvider'];
function usersConfig($stateProvider){
  $stateProvider.state('menu.users', {
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

UsersController.$inject = [];
function UsersController(){

}
