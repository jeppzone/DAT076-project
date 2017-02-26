'use strict';

angular.module('moviez.review', [])

.directive('review', Review)
.controller('ReviewController', ReviewController)
.animation('.slide', [function(){
  return {
    enter: function(element, doneFn) {
      jQuery(element).fadeIn(500, doneFn);
    },

    move: function(element, doneFn) {
      jQuery(element).fadeIn(500, doneFn);
    },

    leave: function(element, doneFn) {
      jQuery(element).fadeOut(500, doneFn);
    }
  };
}]);

function Review(){
  var directive = {
    restrict: 'E',
    templateUrl: 'reviews/review.view.html',
    scope: {
      review: '='
    },
    controller: 'ReviewController',
    controllerAs: 'vm'
  };

  return directive;
}

ReviewController.$inject = ['UserFactory', '$scope', 'ReviewFactory', '$timeout'];
function ReviewController(UserFactory, $scope, ReviewFactory, $timeout){
  var vm = this;
  vm.cancel = cancel;
  vm.save = save;
  vm.deleteReview = deleteReview;
  vm.editedText = $scope.review.text;
  vm.loggedInUser = UserFactory.userInfo;
  vm.showOverlay = true;

  function save() {
    //ReviewFactory.editReview($scope.review)
    $scope.review.text = vm.editedText;
    vm.showOverlay = false;
    vm.editing = false;
    $timeout(function () {
      vm.showOverlay = true;
    }, 1500);
  }

  function cancel() {
    vm.editing = false;
    vm.showOverlay = false;
    $timeout(function () {
      vm.showOverlay = true;
    }, 1500);
  }

  function deleteReview() {
    //ReviewFactory.deleteReview($scope.review.reviewId)
    let index = $scope.$parent.vm.allReviews.indexOf($scope.review);
    $scope.$parent.vm.allReviews.splice(index, 1);
  }
}
