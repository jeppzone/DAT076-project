'use strict';

angular.module('moviez.add-review', [])

.directive('addReview', AddReview)
.controller('AddReviewController', AddReviewController)

function AddReview(){
  var directive = {
    restrict: 'E',
    templateUrl: 'reviews/add-review.view.html',
    scope: {
      movie: '='
    },
    controller: 'AddReviewController',
    controllerAs: 'vm'
  };

  return directive;
}

AddReviewController.$inject = ['UserFactory', '$scope', 'ReviewFactory'];
function AddReviewController(UserFactory, $scope, ReviewFactory){
  var vm = this;
  vm.addReview = addReview;
  $scope.$watch(function(){
    return UserFactory.loggedIn;
  }, function(newValue, oldValue){
    vm.loggedIn = newValue;
  });
  function addReview(){
    return ReviewFactory.createReview(vm.review, vm.rating, $scope.$parent.vm.movie.id)
      .then((result) => {
        $scope.$parent.vm.reviews.forEach(function(review){
          if(review.author.username === UserFactory.userInfo.username){
            $scope.$parent.vm.reviews.splice($scope.$parent.vm.reviews.indexOf(review), 1);
          }
        });
        $scope.$parent.vm.reviews.unshift(result.data);
        vm.adding = false;
      })
  }
}
