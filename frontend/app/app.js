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
    'moviez.home',
    'moviez.movies',
    'moviez.movie',
    'moviez.reviews',
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
