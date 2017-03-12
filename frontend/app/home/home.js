'use strict';

/**
Module containing the 'home' state responsible for displaying content at the tab 'home'.
Will fetch the 20 most popular movies, the 20 latest releases and the 10 latest
reviews before entering the state.
**/
angular.module('moviez.home', [])

.config(homeConfig)
.controller('HomeController', HomeController);

homeConfig.$inject = ['$stateProvider'];
function homeConfig($stateProvider){
  $stateProvider.state('menu.home', {
    resolve: {
      popularMovies: function(MovieFactory){
        return MovieFactory.getPopularMovies(1);
      },
      latestReleases: function(MovieFactory){
        return MovieFactory.getLatestReleases();
      },
      latestReviews: function(ReviewFactory){
        return ReviewFactory.getReviews(10, 'all', 'date', 'desc');
      }

    },
    url: '/home',
    views: {
      'main':{
        templateUrl: '/home/home.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      }
    }
  });
}

HomeController.$inject = ['popularMovies', 'latestReleases', 'latestReviews'];
function HomeController(popularMovies, latestReleases, latestReviews){
  var vm = this;
  vm.movies = popularMovies.data.results;
  vm.latestReleases = latestReleases.data.results;
  vm.reviews = latestReviews.data.reviews;
}
