'use strict';

/* The module menu contains the parent state to which all other states in the
  application inherit from. The menu module is responsible for all navigation
  and is visible and accessible at all times.
*/

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
*/
function MenuController(LoginFactory, UserFactory, $scope, $location, SearchFactory){
  // Get state from URL, in order to change the active tab accordingly on page reload
  $scope.setActiveTab = setActiveTab;
  $scope.tabClasses = {
    home: '',
    movies: '',
    users: '',
    reviews: '',
    profile: ''
  };

  /*Watch to see if the URL changes, and set the active tab to the current state*/
  $scope.$watch(function(){
    return $location.path().split('/')[1];
  }, function(newValue){
    setActiveTab(newValue);
  });

  /*Watch to see if userInfo is changed, in order to control know if the user
  is logged in our out */
  $scope.$watch(function(){
    return UserFactory.userInfo;
  }, function(newValue, oldValue){
    $scope.user = newValue;
    if(isEmpty($scope.user)){
      $scope.loggedIn = false;
    }else{
      $scope.loggedIn = true;
    }

    if(isEmpty($scope.user) && !isEmpty(oldValue)){
      setActiveTab('home'); //User has logged out, set the active tab to home
    }
  }, true);

  $scope.$watch(function(){
    return SearchFactory.searchString;
  }, function(newValue){
      if(newValue){
        setActiveTab('movies'); //User has searched, set active tab to movies
      }
  });

  /*Set the active tab to the parameter tab. If the tab is profile, but the
  user is not logged in, the profile tab should not be active. */
  function setActiveTab(tab){
    if(tab == 'profile' && !UserFactory.loggedIn) {
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
