'use strict';
/**
Module containing the reviews state, which is responsible for displaying all reviews
that exist in the database. It is also responsible for fetching all reviews written by
users that a logged in users follows. It will fetch all reviews in the database before proceeding
into the state.
**/
angular.module('moviez.reviews', [])

.config(reviewsConfig)
.controller('ReviewsController', ReviewsController);

reviewsConfig.$inject = ['$stateProvider'];
function reviewsConfig($stateProvider){
  $stateProvider.state('menu.reviews', {
    resolve: {
      allReviews: function(ReviewFactory) {
        return ReviewFactory.getReviews(undefined, 'all', 'date', 'desc');
      }
    },
    url: '/reviews',
    views: {
      'main':{
        templateUrl: '/reviews/reviews.view.html',
        controller: 'ReviewsController',
        controllerAs: 'vm'
      }
    }
  });
}

ReviewsController.$inject = ['allReviews','ReviewFactory', 'UserFactory', '$scope'];
function ReviewsController(allReviews, ReviewFactory, UserFactory, $scope){
  var vm = this
  vm.filter = filter;
  vm.reviews = allReviews.data.reviews;
  vm.showAllReviews = true;
  vm.loggedIn = UserFactory.loggedIn;
  ReviewFactory.getReviews(undefined, 'feed', 'date', 'desc').then((result) => {
    vm.reviewsFromFollowed = result.data.reviews;
  });

  /* Watch to see if a user logs in or out. If it logs in, then fetch all the reviews
  written by users that the logged in user follows.
  */
  $scope.$watch(function(){
    return UserFactory.loggedIn;
  }, function(newValue) {
    vm.loggedIn = newValue;
    if(vm.loggedIn){
      ReviewFactory.getReviews(undefined, 'feed', 'date', 'desc').then((result) => {
        vm.reviewsFromFollowed = result.data.reviews
      });
    }
  });

  function filter() {
    if(vm.showAllReviews) {
      vm.reviews = allReviews.data.reviews;
    }else{
      vm.reviews = vm.reviewsFromFollowed;
    }
  }
}
