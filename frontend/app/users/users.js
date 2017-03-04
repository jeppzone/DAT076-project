'use strict';

angular.module('moviez.users', [])

.config(usersConfig)
.controller('UsersController', UsersController);

usersConfig.$inject = ['$stateProvider'];
function usersConfig($stateProvider){
  $stateProvider.state('menu.users', {
    resolve: {
      users: function(UserFactory) {
        return UserFactory.getAllUsers();
      },
      followedUsers: function(UserFactory) {
        return UserFactory.getFollowedUsers();
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

UsersController.$inject = ['users', 'followedUsers'];
function UsersController(users, followedUsers) {
  var vm = this;
  vm.users = users.data.users;
  vm.followedUsers = followedUsers.data.following;
  setFollowedUsers();

  function setFollowedUsers() {
    vm.followedUsers.forEach((user) => {
      for(var i = 0; i < vm.users.length; i++){
        if(user.username === vm.users[i].username){
          vm.users[i].follows = true;
          break;
        }
      }
    });
  }
}
