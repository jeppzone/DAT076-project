'use strict';

angular.module('moviez.follow-user', [])

.directive('followUser', followUser)
.controller('FollowUserController', FollowUserController);

function followUser(){
  var directive = {
    restrict: 'E',
    templateUrl: 'users/follow-user.view.html',
    scope: {
      user: '=',
      isProfile: '=' //In profile, only the followed users are shown
    },
    controller: 'FollowUserController',
    controllerAs: 'vm'
  };

  return directive;
}

FollowUserController.$inject = ['$scope', 'UserFactory'];
function FollowUserController($scope, UserFactory){
  var vm = this;
  vm.follow = follow;
  vm.unfollow = unfollow;

  //If we are in the profile view, then the button should show 'Unfollow'
  if($scope.isProfile) {
    $scope.user.follows = true;
  }

  function follow() {
    UserFactory.followUser($scope.user.username).then(() => {
      $scope.user.follows = true;
    });
  }

  function unfollow() {
    UserFactory.unfollowUser($scope.user.username).then(() => {
      $scope.user.follows = false;
      if($scope.isProfile) {
        //Remove the user from the list of followed users
        var index = $scope.$parent.vm.followedUsers.indexOf($scope.user);
        $scope.$parent.vm.followedUsers.splice(index, 1);
      }
    })
  }
}
