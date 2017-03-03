'use strict';
/**
The movie-detailed module contains the movie-detail state, which is repsonsible
for displaying detailed information about a single movie; Both information from
the TMDb API, as well as all reviews belonging to the given movie. It takes one
state parameter:
* @param movieId - the TMDb id of the given movie
**/
angular.module('moviez.movie-detailed', [])

.config(movieDetailedConfig)
.controller('MovieDetailedController', MovieDetailedController);

movieDetailedConfig.$inject = ['$stateProvider'];
function movieDetailedConfig($stateProvider){
  $stateProvider.state('menu.movie-detail', {
    resolve: {
      result: function($stateParams, ReviewFactory){
         return ReviewFactory.getMovie($stateParams.movieId);
       }
    },
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

MovieDetailedController.$inject = ['$scope', 'MovieFactory', '$stateParams', 'ReviewFactory', 'result'];
function MovieDetailedController ($scope, MovieFactory, $stateParams, ReviewFactory, result){
  var vm = this;
  vm.fullPosterPath = '';
  vm.movie = {};
  vm.reviews = result.data.reviews;
  console.log(vm.reviews);
  vm.averageRating = Math.floor(result.data.averageScore);

  $scope.$watch(function(){
    return vm.reviews;
  }, function(){
      var totalRating = 0;
      vm.reviews.forEach((review) => {
        totalRating += review.score;
      });
      vm.averageRating = Math.floor(totalRating / vm.reviews.length);
  }, true);

  MovieFactory.getMovieById($stateParams.movieId).then((result) => {
    vm.movie = result.data;
    vm.fullPosterPath = 'http://image.tmdb.org/t/p/w300' + vm.movie.poster_path;
    vm.movie.release_date = vm.movie.release_date.substring(0,4);
  });
}
