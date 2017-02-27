'use strict';

angular.module('moviez.movie-detailed', [])

.config(movieDetailedConfig)
.controller('MovieDetailedController', MovieDetailedController);

movieDetailedConfig.$inject = ['$stateProvider'];
function movieDetailedConfig($stateProvider){
  $stateProvider.state('menu.movie-detail', {
    url: '/movies/:movieId',
    views: {
      'main':{
        templateUrl: '/movies/movie-detailed.view.html',
        controller: 'MovieDetailedController',
        controllerAs: 'vm'
      }
    }
  });
}

MovieDetailedController.$inject = ['$scope', 'MovieFactory', '$stateParams'];
function MovieDetailedController ($scope, MovieFactory, $stateParams){
  var vm = this;
  vm.fullPosterPath = '';
  vm.movie = {};
  MovieFactory.getMovieById($stateParams.movieId).then((result) => {
    vm.movie = result.data;
    vm.fullPosterPath = 'http://image.tmdb.org/t/p/w300' + vm.movie.poster_path;
    vm.movie.release_date = vm.movie.release_date.substring(0,4);
    console.log(vm.movie);
  })
}
