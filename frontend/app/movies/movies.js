'use strict';

angular.module('moviez.movies', ['infinite-scroll'])

.config(moviesConfig)
.controller('MoviesController', MoviesController);

moviesConfig.$inject = ['$stateProvider'];
function moviesConfig($stateProvider){
  $stateProvider.state('menu.movies', {
    resolve: {
      popularMovies: function(MovieFactory){
         return MovieFactory.getPopularMovies();
       }
    },
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

MoviesController.$inject = ['$scope', 'SearchFactory', 'popularMovies'];
function MoviesController($scope, SearchFactory, popularMovies){
  var vm = this;
  vm.searchString = SearchFactory.searchString;

  if(!SearchFactory.searchString || SearchFactory.searchResult.length < 1){
    vm.shownMovies = popularMovies.data.results;
  }else{
    vm.shownMovies = SearchFactory.searchResult;
  }

  $scope.$watch(function(){
    return SearchFactory.searchResult;
  }, function(newValue){
    vm.searchString = SearchFactory.searchString;
    if(newValue && newValue.length > 0 && vm.searchString){
      vm.allMovies = newValue;
      vm.shownMovies = newValue;
    }else{
      vm.shownMovies = popularMovies.data.results;
    }
  });
}
