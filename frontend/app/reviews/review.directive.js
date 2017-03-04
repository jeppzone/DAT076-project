'use strict';

/** The review directive represents a review card and is responsible for editing
    and deleting the given review. It takes two scope properties:
* @property review - The review object which contains the text, the score and
            the author
* @property title - The title of the movie that the review belongs to
**/
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
      review: '=',
      title: '=',
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
  console.log($scope.review);
  vm.save = save;
  vm.deleteReview = deleteReview;
  vm.vote = vote;
  vm.editedText = $scope.review.text;
  vm.editedScore = $scope.review.score;
  vm.loggedInUser = UserFactory.userInfo;
  vm.showOverlay = true;
  formatDate($scope.review.date);

  function save() {
    ReviewFactory.createReview(vm.editedText, vm.editedScore, $scope.review.movie.id)
      .then((result) => {
        $scope.review.author = result.data.author
        $scope.review.text = result.data.text;
        $scope.review.score = result.data.score;
        $scope.review.voteScore = result.data.voteScore;
        formatDate(result.data.date);
      });
    vm.showOverlay = false;
    vm.editing = false;
    /* Adds a timeout so that the hover overlay is not shown immediately */
    $timeout(function () {
      vm.showOverlay = true;
    }, 1500);
  }

  function cancel() {
    vm.editing = false;
    vm.showOverlay = false;
    /* Adds a timeout so that the hover overlay is not shown immediately */
    $timeout(function () {
      vm.showOverlay = true;
    }, 1500);
  }

  function deleteReview() {
    ReviewFactory.deleteReview($scope.review.id)
    let index = $scope.$parent.vm.reviews.indexOf($scope.review);
    $scope.$parent.vm.reviews.splice(index, 1);
  }

  function vote(vote) {
    ReviewFactory.voteOnReview($scope.review.id, vote).then((result) => {
      $scope.review.voteScore += vote;
      vm.showOverlay = false;
      $timeout(function () {
        vm.showOverlay = true;
      }, 1500);
    })
  }

  /* Format the date on the format 1 Mar 07:47 */
  function formatDate(date) {
    var reviewDate = new Date(new Date(date).getTime());
    var day = reviewDate.toString().substring(8, 10);
    if(day.charAt(0) === '0'){
      day = day.charAt(1);
    }
    var month = reviewDate.toString().substring(4, 7);
    var time = reviewDate.toString().substring(16, 21);
    $scope.review.date = day + ' ' + month + ' ' + time;
  }
}
