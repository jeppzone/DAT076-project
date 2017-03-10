'use strict';

angular.module('moviez.reviews', [])

.config(reviewsConfig)
.controller('ReviewsController', ReviewsController);

reviewsConfig.$inject = ['$stateProvider'];
function reviewsConfig($stateProvider){
  $stateProvider.state('menu.reviews', {
    resolve: {
      allReviews: function(ReviewFactory) {
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

ReviewsController.$inject = ['allReviews','ReviewFactory', 'UserFactory', '$scope'];
function ReviewsController(allReviews, ReviewFactory, UserFactory, $scope){
  var vm = this
  vm.filter = filter;
  vm.reviews = allReviews.data.reviews.reverse();
  vm.showAllReviews = true;
  vm.loggedIn = UserFactory.loggedIn;
  ReviewFactory.getLatestReviews(20, 'feed').then((result) => {
    vm.reviewsFromFollowed = result.data.reviews.reverse();
  });

  $scope.$watch(function(){
    return UserFactory.loggedIn;
  }, function(newValue) {
    console.log('Got new value');
    vm.loggedIn = newValue;
    ReviewFactory.getLatestReviews(20, 'feed').then((result) => {
      vm.reviewsFromFollowed = result.data.reviews.reverse();
    });
  });

  function filter() {
    if(vm.showAllReviews) {
      vm.reviews = allReviews.data.reviews;
    }else{
      vm.reviews = vm.reviewsFromFollowed;
    }
  }
}
