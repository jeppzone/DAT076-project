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
}
