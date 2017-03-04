'use strict';

angular.module('moviez.reviews', [])

.config(reviewsConfig)
.controller('ReviewsController', ReviewsController);

reviewsConfig.$inject = ['$stateProvider'];
function reviewsConfig($stateProvider){
  $stateProvider.state('menu.reviews', {
    resolve: {
      reviews: function(ReviewFactory) {
        return ReviewFactory.getAllReviews();
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

ReviewsController.$inject = ['reviews', '$scope'];
function ReviewsController(reviews, $scope){
  var vm = this;
  vm.reviews = reviews.data.reviews;
  console.log(vm.reviews);
}
