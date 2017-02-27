'use strict';

angular.module('moviez.movie', [])

.directive('movie', Movie)
.controller('MovieController', MovieController);

function Movie(){
  var directive = {
    restrict: 'E',
    templateUrl: 'movies/movie.view.html',
    scope: {
      title: '=',
      poster: '='
    },
    controller: 'MovieController',
    controllerAs: 'vm'
  };

  return directive;
}

MovieController.$inject = ['$scope'];
function MovieController($scope){
  let noImage = 'poster-not-available.jpg';
  if($scope.poster){
    $scope.posterFullPath = 'http://image.tmdb.org/t/p/w300' + $scope.poster;
  }else{
    $scope.posterFullPath = noImage;
  }
}
