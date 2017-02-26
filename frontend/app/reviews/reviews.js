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

ReviewsController.$inject = [];
function ReviewsController(){
  var vm = this;
  vm.allReviews = [{author: 'testing', title: 'The Dark Knight', text: 'Really great movie!'},
    {author: 'Jesper Olsson', title: 'The Dark Knight', text: 'Really great movie!'},
    {author: 'testing', title: 'The Dark Knight', text: 'Really great movie!'},
    {author: 'testing', title: 'The Dark Knight', text: 'Really great movie!'},
    {author: 'testing', title: 'The Dark Knight', text: 'Really great movie!'},
    {author: 'testing', title: 'The Dark Knight', text: 'Really great movie!'},
    {author: 'testing', title: 'The Dark Knight', text: 'Really great movie!'},];
}
