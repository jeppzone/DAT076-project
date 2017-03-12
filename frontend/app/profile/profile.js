'use strict';

/* Module containing the 'profile' state, which is responsible for displaying
information in the profile tab (the tab with the user's username). The users that
the logged in users follows, the reviews that the user has written and the lists
that the user have created will be fetched before entering the state.
*/
angular.module('moviez.profile', [])

.config(profileConfig)
.controller('ProfileController', ProfileController);

profileConfig.$inject = ['$stateProvider'];
function profileConfig($stateProvider){
  $stateProvider.state('menu.profile', {
    resolve: {
      followedUsers: function(UserFactory) {
        return UserFactory.getFollowedUsers();
      },
      myReviews: function(UserFactory, ReviewFactory){
        return ReviewFactory.getUserReviews(UserFactory.userInfo.username);
      },
      lists: function(UserFactory, ListFactory) {
        return ListFactory.getListsByUser(UserFactory.userInfo.username);
      }
    },
    url: '/profile',
    views: {
      'main':{
        templateUrl: '/profile/profile.view.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      }
    }
  });
}

ProfileController.$inject = ['UserFactory', 'followedUsers', 'myReviews', 'lists'];
function ProfileController(UserFactory, followedUsers, myReviews, lists){
  var vm = this;
  vm.save = save;
  vm.cancel = cancel;
  vm.user = angular.copy(UserFactory.userInfo);
  vm.editedDescription = vm.user.text;
  vm.editedUsername = vm.user.username;
  vm.editedEmail = vm.user.email;
  vm.reviews = myReviews.data.reviews;
  vm.followedUsers = followedUsers.data.following;
  vm.lists = lists.data.lists;

  function save() {
    if(vm.editedDescription !== vm.user.text){
      UserFactory.editUserProfile(vm.editedDescription).then((result) => {
        UserFactory.updateUser(Object.assign(result.data.user, result.data.profile));
        vm.user = result.data.user;
        vm.editing = false;
      });
    }

    UserFactory.editUserCredentials(vm.editedUsername, vm.editedEmail, vm.editedPassword)
      .then((result) => {
        UserFactory.updateUser(result.data);
        vm.user.username = result.data.username;
        vm.user.email = result.data.email;
        vm.editing = false;
      });
  }

  function cancel() {
    vm.editing = false;
    resetToOriginal();
  }

  function resetToOriginal(){
    vm.editedDescription = vm.user.text;
    vm.editedUsername = vm.user.username;
    vm.editedEmail = vm.user.email;
  }
}
