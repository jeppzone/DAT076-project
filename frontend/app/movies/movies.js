'use strict';
/**
Module containing the movies state, which is repsonsible for displaying movies
in the 'Movies tab'. It shows either one of two things: If the user has searched for
a movie, it displays the search results of that search query. It a search on a movies
has not been performed, than the user can browse popular movies fetched from the TMDb API.
When a user is reaching the bottom of the window, then 20 more movies are loaded.
**/
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

  /*
  If we have a search string, a non-empty search results array and the search type is Movies,
  then show the search results. If not, then show the popular movies.
  */
  if(!SearchFactory.searchString || !SearchFactory.searchResult || SearchFactory.searchResult.length < 1 || SearchFactory.searchType !== 'Movies'){
    vm.shownMovies = popularMovies.data.results;
  }else{
    vm.shownMovies = SearchFactory.searchResult;
  }

  /* Watch to see if the search result changes. If the search type is movies, and
  the search result is non empty, then show the search resutls. Otherwise, show the
  popular movies.
  */
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

  /* Watch to see if the search string changes. If the search string is empty and
  the search type is movies, then show the popular movies. 
  */
  $scope.$watch(function() {
    return SearchFactory.searchString;
  }, function(newValue){
    if(!newValue && SearchFactory.searchType === 'Movies'){
      vm.searchString = newValue;
      vm.shownMovies = popularMovies.data.results;
    }
  });

  /**
  Function called when the user is reaching the bottom of the browser window.
  Will fetch the next page of the results from the TMDb API.
  **/
  function loadMoreMovies () {
    if(!vm.searchString || vm.searchType !== 'Movies'){
      vm.pageToLoad ++;
      if(vm.pageToLoad < vm.totalPages){
        MovieFactory.getPopularMovies(vm.pageToLoad).then((result) => {
          vm.shownMovies = vm.shownMovies.concat(result.data.results);
        });
      }
    }
  }
}
