'use strict';

angular.module('moviez.review-factory', ['ngCookies'])

.factory('ReviewFactory', ReviewFactory);

ReviewFactory.$inject = ['ApiBase', '$http', '$state', '$cookies', 'UserFactory'];

function ReviewFactory(ApiBase, $http) {
  var service = {
    getMovie: getMovie,
    createReview: createReview,
    editReview: editReview,
    deleteReview: deleteReview
  };

  return service;

  function getMovie(movieId){
    var url = ApiBase + '/movies/' + movieId;
    console.log(url);
    return $http.get(ApiBase + '/movies/' + movieId);
  }

  function createReview(review, rating, movieId) {
    return $http.post(ApiBase + '/movies/'+movieId + '/review', {
      text: review,
      score: rating
    });
  }

  function editReview(reviewId, review) {
    //return $http.put(ApiBase + '/reviews/' + reviewId, review)
  }

  function deleteReview(reviewId) {
    //return $http.delete(ApiBase + '/reviews/' + reviewId)
  }

}
