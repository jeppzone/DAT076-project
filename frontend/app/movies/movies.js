'use strict';

angular.module('moviez.movies', [])

.config(moviesConfig)
.controller('MoviesController', MoviesController);

moviesConfig.$inject = ['$stateProvider'];
function moviesConfig($stateProvider){
  $stateProvider.state('menu.movies', {
    url: '/movies',
    views: {
      'main':{
        templateUrl: '/movies/movies.view.html',
        controller: 'MoviesController',
        controllerAs: 'vm'
      }
    }
  });
}

MoviesController.$inject = [];
function MoviesController(){
  var vm = this;
  vm.movies = ['Test1', 'Test2', 'Test3', 'Test4', 'Test5', 'Test6', 'Test7',
    'Test8', 'Test9', 'Test10', 'Test11', 'Test12', 'Test13', 'Test14'];
}
