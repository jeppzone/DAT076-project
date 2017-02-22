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
    'ui.router',
    'moviez.login-register',
    'moviez.home'
  ])
  .config(appConfig)

  .controller('AppController', AppController );

  appConfig.$inject = ['$urlRouterProvider', '$httpProvider', '$locationProvider'];

  function appConfig($urlRouterProvider, $httpProvider, $locationProvider){
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/');
  }

  AppController.$inject = ['$scope', '$state'];

  function AppController($scope, $state){

  }
