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
      }/*,
      myReviews: function(UserFactory, ReviewFactory){
        return ReviewFactory.getUserReviews(UserFactory.userInfo.username);
      }*/
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

ProfileController.$inject = ['UserFactory', 'followedUsers', 'myReviews'];
function ProfileController(UserFactory, followedUsers, myReviews){
  var vm = this;
  vm.save = save;
  vm.cancel = cancel;
  vm.user = angular.copy(UserFactory.userInfo);
  //vm.myReviews = myReviews.data;
  console.log(vm.myReviews);
  vm.followedUsers = followedUsers.data.following;

  function save() {
    vm.editing = false;
  }

  function cancel() {
    vm.editing = false;
  }
}
