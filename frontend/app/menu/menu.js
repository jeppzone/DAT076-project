'use strict';

angular.module('moviez.menu', [])

.config(menuConfig)
.controller('MenuController', MenuController);

menuConfig.$inject = ['$stateProvider'];
function menuConfig($stateProvider){
  $stateProvider.state('menu', {
    url: '',
    abstract: true,
    templateUrl: 'menu/menu.view.html',
    controller: 'MenuController',
    controllerAs: 'vm'
  });
}

MenuController.$inject = ['LoginFactory', 'UserFactory', '$scope', '$rootScope', '$location'];
function MenuController(LoginFactory, UserFactory, $scope, $rootScope, $location){
  let state = $location.path().split('/')[1]
  $scope.setActiveTab = setActiveTab;
  $scope.tabClasses = {
    home: 'active',
    movies: '',
    users: '',
    reviews: ''
  };
  setActiveTab(state);

  $scope.$watch(function(){
    return UserFactory.userInfo;
  }, function(newValue){
    $rootScope.user = newValue;
  }, true);

  function setActiveTab(tab){
    Object.keys($scope.tabClasses).forEach((key) => {
      if(key === tab){
        $scope.tabClasses[key] = 'active';
      }else{
        $scope.tabClasses[key] = '';
      }
    });
  }
}
