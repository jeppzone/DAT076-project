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

UsersController.$inject = ['users', 'followedUsers', 'SearchFactory', '$scope'];
function UsersController(users, followedUsers, SearchFactory, $scope) {
  var vm = this;
  vm.allUsers = users.data.users;
  vm.users = [];
  vm.followedUsers = followedUsers.data.following;
  vm.searchString = SearchFactory.searchString;
  vm.searchType = SearchFactory.searchType;

  $scope.$watch(function() {
    return SearchFactory.searchString;
  }, function(newValue){
    vm.searchString = newValue;
    vm.searchType = SearchFactory.searchType;
    if(newValue){
      if(vm.searchType === 'Users'){
        filterUsers(newValue);
        setFollowedUsers();
      }
    }else{
      vm.users = users.data.users;
    }
  });

  $scope.$watch(function() {
    return SearchFactory.searchType;
  }, function(newValue){
    if(newValue === 'Users' && SearchFactory.searchString){
      filterUsers(SearchFactory.searchString);
      setFollowedUsers();
    }
  });

  function filterUsers(searchString) {
    vm.users = [];
    vm.allUsers.forEach((user) => {
      if(user.username.indexOf(searchString) !== -1){
        vm.users.push(user);
      }
    });
  }

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
