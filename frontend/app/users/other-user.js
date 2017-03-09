'use strict';

angular.module('moviez.other-user', [])

.config(otherUserConfig)
.controller('OtherUserController', OtherUserController);

otherUserConfig.$inject = ['$stateProvider']
function otherUserConfig($stateProvider){
  $stateProvider.state('menu.other-user', {
    resolve: {
      user: function(UserFactory, $stateParams) {
        return UserFactory.getUserProfile($stateParams.username);
      },
      lists: function(ListFactory, $stateParams){
        return ListFactory.getListsByUser($stateParams.username);
      },
      reviews: function(ReviewFactory, $stateParams){
        return ReviewFactory.getUserReviews($stateParams.username)
      }
    },
    url: '/users/:username',
    views: {
      'main':{
        templateUrl: '/users/other-user.view.html',
        controller: 'OtherUserController',
        controllerAs: 'vm'
      }
    }
  });
}
OtherUserController.$inject = ['user', 'lists', 'reviews'];
function OtherUserController(user, lists, reviews) {
  var vm = this;
  vm.user = Object.assign(user.data.user, user.data.profile);
  vm.lists = lists.data.lists;
  vm.reviews = reviews.data.reviews;
  console.log(vm.reviews);
}
