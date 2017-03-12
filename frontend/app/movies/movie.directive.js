'use strict';
/**
Module containing the movie directive, which is repsonsible for displaying
a single movie in a grid of movies. It takes three scope properties:
*@property movie - An object containing the movie to be displayed
*@property posterWidth - Number telling the width of the poster to be displayed
*@property inList - Boolean telling whether the movie is displayed in a list or not
**/

angular.module('moviez.movie', [])

.directive('movie', Movie)
.controller('MovieController', MovieController);

function Movie(){
  var directive = {
    restrict: 'E',
    templateUrl: 'movies/movie.view.html',
    scope: {
      movie: '=',
      posterWidth: '=',
      inList: '='
    },
    controller: 'MovieController',
    controllerAs: 'vm'
  };

  return directive;
}

MovieController.$inject = ['$scope'];
function MovieController($scope){
  let noImage = 'poster-not-available.jpg';

  if($scope.movie.poster_path){
    $scope.posterFullPath = 'http://image.tmdb.org/t/p/w' + $scope.posterWidth + $scope.movie.poster_path;
  }else if($scope.movie.posterPath){
    $scope.posterFullPath = 'http://image.tmdb.org/t/p/w' + $scope.posterWidth + $scope.movie.posterPath;
  }else{
    $scope.posterFullPath = noImage;
  }
}
