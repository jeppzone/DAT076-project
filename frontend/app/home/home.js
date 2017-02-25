'use strict';

angular.module('moviez.home', [])

.config(homeConfig)
.controller('HomeController', HomeController);

homeConfig.$inject = ['$stateProvider'];
function homeConfig($stateProvider){
  $stateProvider.state('menu.home', {
    url: '/home',
    views: {
      'main':{
        templateUrl: '/home/home.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      }
    }
  });
}

HomeController.$inject = [];
function HomeController(){

}
