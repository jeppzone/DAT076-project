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

MoviesController.$inject = ['$scope', 'SearchFactory', 'MovieFactory', 'popularMovies'];
function MoviesController($scope, SearchFactory, MovieFactory, popularMovies){
  var vm = this;
  vm.loadMoreMovies = loadMoreMovies;
  vm.totalPages = popularMovies.data.total_pages;
  vm.pageToLoad = 1;
  vm.searchString = SearchFactory.searchString;
  vm.searchType = SearchFactory.searchType;

  if(!SearchFactory.searchString || !SearchFactory.searchResult || SearchFactory.searchResult.length < 1){
    vm.shownMovies = popularMovies.data.results;
  }else{
    vm.shownMovies = SearchFactory.searchResult;
  }

  $scope.$watch(function() {
    return SearchFactory.searchResult;
  }, function(newValue){
    vm.searchString = SearchFactory.searchString;
    vm.searchType = SearchFactory.searchType;
    if(vm.searchType === 'Movies' && newValue && newValue.length > 0 && vm.searchString){
      vm.shownMovies = newValue;
    }else{
      vm.shownMovies = popularMovies.data.results;
    }
  });

  function loadMoreMovies () {
    if(!vm.searchString){
      vm.pageToLoad ++;
      if(vm.pageToLoad < vm.totalPages){
        MovieFactory.getPopularMovies(vm.pageToLoad).then((result) => {
          vm.shownMovies = vm.shownMovies.concat(result.data.results);
        });
      }
    }
  }
}
