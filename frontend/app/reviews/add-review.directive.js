'use strict';
/**
Module containing the add-review directive, which is responsible for controlling
the adding of a review. It is used in the movie-detailed state. It is only visible
if a user is logged in. At first, it only shows a button saying 'Add review' and when clicked,
the button disappears and is replaced with rating stars, a text area and two buttons 'Cancel' and 'Save'
**/
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

  /* Send request to add the review to the database. If successful, then check to see
  if a review has previously been written by the same auhtor on the same movie. If so,
  then remove the old review and add the new review to the parent state. 
  */
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
