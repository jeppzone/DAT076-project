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

MoviesController.$inject = ['$scope', 'SearchFactory'];
function MoviesController($scope, SearchFactory){
  var vm = this;
  const MOVIES_PER_ROW = 6;
  //vm.loadMoreMovies = loadMoreMovies;

  $scope.$watch(function(){
    return SearchFactory.searchResult;
  }, function(newValue, oldValue){
    if(SearchFactory.searchString){
      vm.allMovies = newValue;
      vm.shownMovies = newValue;
      console.log(vm.allMovies.length);
    }
  });

  function loadMoreMovies(){
    if(vm.shownMovies.length < (vm.allMovies.length - MOVIES_PER_ROW-1)){
      for(var i = 0; i < MOVIES_PER_ROW; i++){
        if(vm.allMovies[i]){
          vm.shownMovies.push(vm.allMovies[vm.shownMovies.length]);
        }
      }
    }
  }

    /*

  function setOriginalList() {
    vm.allMovies = [];
    vm.shownMovies = [];
    for(var i = 0; i < 1000; i++){
      vm.allMovies.push({title: 'Movie ' + i, poster: 'http://placehold.it/300x440'});
    }

    for(var i = 0; i < 30; i++){
      vm.shownMovies.push(vm.allMovies[i]);
    }
  }*/
}
