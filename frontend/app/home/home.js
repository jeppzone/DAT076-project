'use strict';

angular.module('moviez.home', [])

.config(homeConfig)
.controller('HomeController', HomeController);

homeConfig.$inject = ['$stateProvider'];
function homeConfig($stateProvider){
  $stateProvider.state('menu.home', {
    resolve: {
      popularMovies: function(MovieFactory){
         return MovieFactory.getPopularMovies();
       },
       latestReviews: function(ReviewFactory){
          return ReviewFactory.getMovie('341174'); //For testing purposes, change this later
        },
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

HomeController.$inject = ['popularMovies', 'latestReviews'];
function HomeController(popularMovies, latestReviews){
  var vm = this;
  vm.movies = popularMovies.data.results;
  vm.latestReviews = latestReviews.data.reviews;
  console.log(vm.latestReviews);
}
