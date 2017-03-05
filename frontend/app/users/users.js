'use strict';

/* Module responsible for displaying users in the 'Users tab'. It is also
responsible for filtering users when a search has been performed with the searchType 'Users'
The state needs to resolve fetching all users from the API, as well as fetching
all users that the logged in user follows before proceeding. This state
is only reachable and visible when a user is logged in.
*/
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

  /* If searchString is not empty and the searchType is users, perform the search,
  otherwise show all users */
  $scope.$watch(function() {
    return SearchFactory.searchString;
  }, function(newValue){
    vm.searchString = newValue;
    vm.searchType = SearchFactory.searchType;
    if(newValue && vm.searchType === 'Users'){
      filterUsers(newValue);
      setFollowedUsers();
    }else{
      vm.users = vm.allUsers;
      setFollowedUsers();
    }
  });

  /*If searchType changed to Users and there is a search string, perform the search */
  $scope.$watch(function() {
    return SearchFactory.searchType;
  }, function(newValue){
    vm.searchString = SearchFactory.searchString;
    vm.searchType = SearchFactory.searchType
    if(newValue === 'Users' && vm.searchString){
      filterUsers(vm.searchString);
      setFollowedUsers();
    }
  });

  /* Simple filtering function that just checks if the whole search string is a part
  of the username. If so, then include it. If not, don't include it */
  function filterUsers(searchString) {
    vm.users = [];
    vm.allUsers.forEach((user) => {
      if(user.username.indexOf(searchString) !== -1){
        vm.users.push(user);
      }
    });
  }

  /* Function that sets which users the logged in user follows, in order to
  know whether to show 'Unfollow' or 'Follow' */
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
