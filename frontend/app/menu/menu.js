'use strict'

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
  var vm = this;
  console.log(vm);
  vm.test = 'test';
  $scope.$watch(function(){
    return UserFactory.userInfo;
  }, function(newValue, oldValue){
    $rootScope.user = newValue;
  }, true);

  return vm;
}
