'use strict';

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

    $http.defaults.headers.common.Authorization = token;
    $http.defaults.headers.post.Authorization = token;

    var day = 24 * 60 * 60 * 1000;
    var today = new Date().getTime();
    var expireDate = new Date(today + 31 * day);

    $cookies.put('auth', token, {expires: expireDate});
  }

  function clearCredentials(){
    UserFactory.loggedIn = false;
    UserFactory.userInfo = {};

    $http.defaults.headers.common.Authorization= '';
    $http.defaults.headers.post.Authorization = '';
    $cookies.remove('auth');

    $state.go('menu.home');
  }
}
