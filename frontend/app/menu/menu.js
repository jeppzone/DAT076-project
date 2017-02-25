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
    reviews: '',
    profile: ''
  };
  setActiveTab(state);

  $scope.$watch(function(){
    return UserFactory.userInfo;
  }, function(newValue){
    $rootScope.user = newValue;
    if(isEmpty($rootScope.user)){
      setActiveTab('home'); //User has logged out, set the active tab to home
    }
  }, true);

  function setActiveTab(tab){
    if(tab == 'profile' && !$rootScope.user) {
      $scope.tabClasses.profile = '';
      return;
    }
    Object.keys($scope.tabClasses).forEach((key) => {
      if(key === tab){
        $scope.tabClasses[key] = 'active';
      }else{
        $scope.tabClasses[key] = '';
      }
    });
  }

  //Check that the given object is empty
  function isEmpty(object){
    for(var i in object){
        if(object.hasOwnProperty(i)){
            return false;
        }
    }
    return true;
  }
}
