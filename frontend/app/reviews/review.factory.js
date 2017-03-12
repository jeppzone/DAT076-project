'use strict';
/**
Module containing the review-factory, which is repsonsible for all communication
to the backend regarding reviews.
**/
angular.module('moviez.review-factory', ['ngCookies'])

.factory('ReviewFactory', ReviewFactory);

ReviewFactory.$inject = ['ApiBase', '$http', '$state', '$cookies', 'UserFactory'];

function ReviewFactory(ApiBase, $http) {
  var service = {
    getReviews: getReviews,
    getMovie: getMovie,
    getUserReviews: getUserReviews,
    createReview: createReview,
    deleteReview: deleteReview,
    voteOnReview: voteOnReview
  };

  return service;

  function getReviews(limit, show, sortBy, sortOrder) {
    return $http.get(ApiBase + '/reviews', {
      params: {limit: limit, show: show, sortby: sortBy, sortorder: sortOrder}
    });
  }

  function getMovie(movieId){
    return $http.get(ApiBase + '/movies/' + movieId);
  }

  function getUserReviews(username) {
    return $http.get(ApiBase + '/users/' + username + '/reviews');
  }

  function createReview(review, rating, movieId) {
    return $http.post(ApiBase + '/movies/' + movieId + '/reviews', {
      text: review,
      score: rating
    });
  }

  function deleteReview(reviewId) {
    return $http.delete(ApiBase + '/reviews/' + reviewId);
  }

  function voteOnReview(reviewId, vote){
    return $http.put(ApiBase + '/reviews/' + reviewId, {},
    {
      params: {vote: vote}
    });
  }

}
