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

ProfileController.$inject = [];
function ProfileController(){

}
