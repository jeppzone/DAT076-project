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
    'moviez.review-factory',
    'moviez.users',
    'moviez.profile',
    'moviez.register-factory',
    "moviez.login-factory",
    'moviez.login-register-modal',
    'moviez.login-register',
    'moviez.user-factory',
  ])
  .run(['$rootScope', 'UserFactory', function($rootScope, UserFactory){
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
      UserFactory.getUser();
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
    $urlRouterProvider.otherwise('/home');
    $qProvider.errorOnUnhandledRejections(false);
  }

  AppController.$inject = ['$scope', '$state'];

  function AppController($scope, $state){
    //$state.go('menu.profile')
  }
