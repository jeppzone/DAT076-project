'use strict';

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
        return ReviewFactory.getLatestReviews(7);
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
  vm.reviews = latestReviews.data.reviews.reverse();
}
