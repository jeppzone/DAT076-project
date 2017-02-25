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

}
