'use strict';

angular.module('moviez.movies', ['infinite-scroll'])

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
  const MOVIES_PER_ROW = 11;
  vm.loadMoreMovies = loadMoreMovies;
  vm.allMovies = [];
  vm.shownMovies = [];
  for(var i = 0; i < 1000; i++){
    vm.allMovies.push('Movie ' + i);
  }

  for(var i = 0; i < 55; i++){
    vm.shownMovies.push(vm.allMovies[i]);
  }

  function loadMoreMovies(){
    if(vm.shownMovies.length < (vm.allMovies.length - MOVIES_PER_ROW-1)){
      for(var i = 0; i < MOVIES_PER_ROW; i++){
        vm.shownMovies.push(vm.allMovies[vm.shownMovies.length]);
      }
    }
  }
}
