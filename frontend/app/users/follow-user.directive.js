'use strict';

angular.module('moviez.follow-user', [])

.directive('followUser', followUser)
.controller('FollowUserController', FollowUserController);

function followUser(){
  var directive = {
    restrict: 'E',
    templateUrl: 'users/follow-user.view.html',
    scope: {
      user: '='
    },
    controller: 'FollowUserController',
    controllerAs: 'vm'
  };

  return directive;
}

FollowUserController.$inject = ['$scope'];
function FollowUserController($scope){
  var vm = this;
  vm.buttonValue = 'Unfollow';
}
