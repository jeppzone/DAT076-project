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

MenuController.$inject = ['LoginFactory', 'UserFactory', '$scope', '$location', 'SearchFactory'];

/* Using $scope in this controller instead of vm=this, beacuse controllerAs did for some reason not work here
   This is incosistent, and should be changed
*/
function MenuController(LoginFactory, UserFactory, $scope, $location, SearchFactory){
  console.log('MenuController');
  let state = $location.path().split('/')[1];
  console.log(state);
  $scope.setActiveTab = setActiveTab;
  $scope.tabClasses = {
    home: '',
    movies: '',
    users: '',
    reviews: '',
    profile: ''
  };
  setActiveTab(state);

  $scope.$watch(function(){
    return UserFactory.userInfo;
  }, function(newValue, oldValue){
    $scope.user = newValue;
    console.log('In watch')
    if(isEmpty($scope.user)){
      $scope.loggedIn = false;
    }else{
      $scope.loggedIn = true;
    }
    console.log('Setting new value');
    if(isEmpty($scope.user) && !isEmpty(oldValue)){
      setActiveTab('home'); //User has logged out, set the active tab to home
    }
  }, true);

  $scope.$watch(function(){
    return SearchFactory.searchString;
  }, function(newValue, oldValue){
      if(newValue){
        setActiveTab('movies'); //User has searched, set active tab to movies
      }
  });

  function setActiveTab(tab){
    if(tab == 'profile' && !$scope.loggedIn) {
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
