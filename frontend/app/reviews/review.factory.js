'use strict';

angular.module('moviez.review-factory', ['ngCookies'])

.factory('ReviewFactory', ReviewFactory);

ReviewFactory.$inject = ['ApiBase', '$http', '$state', '$cookies', 'UserFactory'];

function ReviewFactory(ApiBase, $http) {
  var service = {
    getMovie: getMovie,
    getUserReviews: getUserReviews,
    getAllReviews: getAllReviews,
    getLatestReviews: getLatestReviews,
    createReview: createReview,
    editReview: editReview,
    deleteReview: deleteReview,
    voteOnReview: voteOnReview
  };

  return service;

  function getMovie(movieId){
    return $http.get(ApiBase + '/movies/' + movieId);
  }

  function getUserReviews(username) {
    return $http.get(ApiBase + '/' + username + '/reviews');
  }

  function getAllReviews() {
    return $http.get(ApiBase + '/reviews/all');
  }

  function getLatestReviews(nbrOfReviews){
    return $http.get(ApiBase + '/reviews/latest', {
      params: {limit: nbrOfReviews}
    });
  }

  function createReview(review, rating, movieId) {
    return $http.post(ApiBase + '/movies/' + movieId + '/review', {
      text: review,
      score: rating
    });
  }

  function editReview(reviewId, review) {
    //return $http.put(ApiBase + '/reviews/' + reviewId, review)
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
