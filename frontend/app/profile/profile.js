'use strict';

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
  vm.reviews = myReviews.data.reviews;
  vm.followedUsers = followedUsers.data.following;
  vm.lists = lists.data.lists;

  function save() {
    UserFactory.editUserProfile(vm.user.text).then((result) => {
      UserFactory.updateUser(Object.assign(result.data.user, result.data.profile));
      vm.editing = false;
    });
  }

  function cancel() {
    vm.editing = false;
    vm.editedDescription = vm.user.text;
  }
}
