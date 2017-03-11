'use strict';
/**
Module containing the login factory, which is responsible for making all requests
regarding authentication to the backend. It does also manage the creation and deletion
of the 'auth' cookie.
**/
angular.module('moviez.login-factory', ['ngCookies'])

.factory('LoginFactory', LoginFactory);

LoginFactory.$inject = ['ApiBase', '$http', '$state', '$cookies', 'UserFactory'];

function LoginFactory(ApiBase, $http, $state, $cookies, UserFactory) {
  var service = {
    loginUser: loginUser,
    setCredentials: setCredentials,
    clearCredentials: clearCredentials,
  };

  return service;

  function loginUser(user) {
    return $http.post(ApiBase + '/login', {
      user: user.username,
      password: user.password
    });
  }

  function setCredentials(token){
    UserFactory.loggedIn = true;

    var day = 24 * 60 * 60 * 1000;
    var today = new Date().getTime();
    var expireDate = new Date(today + 31 * day);

    $cookies.put('auth', token, {expires: expireDate});
  }

  function clearCredentials(){
    UserFactory.loggedIn = false;
    UserFactory.userInfo = {};

    $cookies.remove('auth');
    $state.go('menu.home');
  }
}
