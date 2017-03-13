'use strict';

/**
This is the entry point of the application. Here, all dependecies are loaded,
as well as global functions that are run everytime a state is changed and everytime
a http request is sent.
**/
angular
  .module('frontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
    'ui.toggle',
    'dndLists',
    'moviez.menu',
    'moviez.search',
    'moviez.search-factory',
    'moviez.home',
    'moviez.movies',
    'moviez.movie',
    'moviez.movie-detailed',
    'moviez.movie-factory',
    'moviez.tmdb-factory',
    'moviez.review',
    'moviez.reviews',
    'moviez.add-review',
    'moviez.review-factory',
    'moviez.users',
    'moviez.follow-user',
    'moviez.profile',
    'moviez.register-factory',
    "moviez.login-factory",
    'moviez.login-register-modal',
    'moviez.login-register',
    'moviez.user-factory',
    'moviez.other-user',
    'moviez.lists',
    'moviez.list',
    'moviez.list-factory',
    'moviez.add-list-modal'
  ])
  .run(['$rootScope', 'UserFactory', '$cookies', '$state', function($rootScope, UserFactory, $cookies, $state){
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
      /* Everytime a state is changed, fetch the user and validate before continuing */
      if($rootScope.stateChangeByPass){
        $rootScope.stateChangeByPass = false;
        return;
      }
      evt.preventDefault();
      if($cookies.get('auth')){
        UserFactory.getMe().then((result) => {
          //We have a user, proceed to state
          if(result.data.user){
            UserFactory.updateUser(Object.assign(result.data.user, result.data.profile));
            UserFactory.loggedIn = true;
            $rootScope.stateChangeByPass = true;
            $state.go(toState, toParams);
          }else{
            $rootScope.stateChangeByPass = true;
            $state.go('menu.home');
          }
        }, () => {
          //We don't have a user and tried to access users or profile. Redirect to home
          if(toState.name === 'menu.users' || toState.name === 'menu.profile' || toState.name ==='menu.other-user'){
            $rootScope.stateChangeByPass = true;
            $state.go('menu.home');
          }
        });
      }else {
        //Auth cookie is empty, but we tried to access users or profile. Redirect to home
        if(toState.name === 'menu.users' || toState.name === 'menu.profile' || toState.name ==='menu.other-user'){
          $rootScope.stateChangeByPass = true;
          $state.go('menu.home');
        //Auth cookie is empty, but we didn't try to access a state that needs authentication. Proceed to state
        }else{
          $rootScope.stateChangeByPass = true;
          $state.go(toState, toParams);
        }
      }
    });
  }])
  .config(appConfig)
  .constant('ApiBase', 'http://localhost:3000')
  .constant('TMDbApiBase', 'http://api.themoviedb.org/3/')
  .constant('ApiKey', 'api_key=f2975c7499d3ec3abb0aef5401787eb2')
  .directive('loading', Loading)
  .controller('AppController', AppController );

  appConfig.$inject = ['$urlRouterProvider', '$httpProvider', '$locationProvider', '$qProvider'];

  function appConfig($urlRouterProvider, $httpProvider, $locationProvider, $qProvider){
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/home'); // If url does not match, go to home
    $qProvider.errorOnUnhandledRejections(false);

    /* Intercept all HTTP Requests and put authorization header only if the
       request is made to localhost (meaning our REST API), because TMDb API does
       not accept the authorization header
    */
    $httpProvider.interceptors.push(['$q', '$injector', '$cookies',
      function(q, injector, $cookies){
        return{
          request: function(config) {
            config.headers = config.headers || {};
            if(config.url.indexOf('localhost') > 0){
              config.headers.authorization = $cookies.get('auth');
            }
            return config;
          }
        };
    }]);
  }

  Loading.$inject = ['$http'];
  function Loading($http){
    var directive = {
      restrict: 'A',
      link: function(scope, element, attrs){
        scope.isLoading = function() {
          return $http.pendingRequests.length > 0;
        };
        scope.$watch(scope.isLoading, function(value) {
          if(value){
            element.removeClass('ng-hide');
          }else{
            element.addClass('ng-hide');
          }
        });
      }
    };

    return directive;
  }

  AppController.$inject = ['$scope', '$state'];

  function AppController($scope, $state){
  }
