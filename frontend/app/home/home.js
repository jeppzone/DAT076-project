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
      followedUsers: function(UserFactory){
        return UserFactory.getFollowedUsers();
      },
      latestReviews: function(ReviewFactory){
        return ReviewFactory.getLatestReviews(1); //For testing purposes, change this later
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

HomeController.$inject = ['popularMovies', 'followedUsers', 'latestReviews'];
function HomeController(popularMovies, followedUsers, latestReviews){
  var vm = this;
  vm.movies = popularMovies.data.results;
  vm.followedUsers = followedUsers.data.following;
  vm.latestReviews = latestReviews.data.reviews;
  console.log(vm.latestReviews);
  console.log(vm.followedUsers);
}
