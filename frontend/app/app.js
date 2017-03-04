'use strict';

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
  .module('frontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
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
          if(result.data.user){
            UserFactory.updateUser(result.data.user);
            UserFactory.loggedIn = true;
            $rootScope.stateChangeByPass = true;
            $state.go(toState, toParams);
          }else{
            $rootScope.stateChangeByPass = true;
            $state.go('home');
          }
        }, () => {
          $rootScope.stateChangeByPass = true;
          $state.go('home');
        });
      }else {
        if(toState === 'users' || toState === 'profile'){
          $rootScope.stateChangeByPass = true;
          $state.go('home');
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

  AppController.$inject = ['$scope', '$state'];

  function AppController($scope, $state){
  }
