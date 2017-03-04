'use strict';

angular.module('moviez.reviews', [])

.config(reviewsConfig)
.controller('ReviewsController', ReviewsController);

reviewsConfig.$inject = ['$stateProvider'];
function reviewsConfig($stateProvider){
  $stateProvider.state('menu.reviews', {
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

ReviewsController.$inject = ['ReviewFactory', '$scope'];
function ReviewsController(ReviewFactory, $scope){
  var vm = this;
  ReviewFactory.getAllReviews().then((result) => {
    vm.reviews = result.data.reviews;
  });

}
