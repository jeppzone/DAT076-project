'use strict';

angular.module('moviez.profile', [])

.config(profileConfig)
.controller('ProfileController', ProfileController);

profileConfig.$inject = ['$stateProvider'];
function profileConfig($stateProvider){
  $stateProvider.state('menu.profile', {
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

ProfileController.$inject = ['UserFactory'];
function ProfileController(UserFactory){
  var vm = this;
  vm.user = UserFactory.userInfo;
  console.log(vm.user);
}
