'use strict';

angular.module('moviez.review-factory', ['ngCookies'])

.factory('ReviewFactory', ReviewFactory);

ReviewFactory.$inject = ['ApiBase', '$http', '$state', '$cookies', 'UserFactory'];

function ReviewFactory(ApiBase, $http) {
  var service = {
    createReview: createReview,
    editReview: editReview,
    deleteReview: deleteReview
  };

  return service;

  function createReview(review) {
    //return $http.post(ApiBase + '/reviews', review)
  }

  function editReview(reviewId, review) {
    //return $http.put(ApiBase + '/reviews/' + reviewId, review)
  }

  function deleteReview(reviewId) {
    //return $http.put(ApiBase + '/reviews/' + reviewId)
  }
}
