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

MenuController.$inject = ['LoginFactory', 'UserFactory', '$scope', '$rootScope'];
function MenuController(LoginFactory, UserFactory, $scope, $rootScope){
  $scope.setActiveTab = setActiveTab;
  $scope.tabClasses = {
    home: 'active',
    movies: '',
    users: '',
    reviews: ''
  };

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
