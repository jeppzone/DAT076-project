'use strict';

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
  }else{
    $scope.posterFullPath = noImage;
  }
}
