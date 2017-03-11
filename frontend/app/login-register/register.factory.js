'use strict';
/**
Module containing the register factory, which is responsible for making all requests
regarding registration to the backend. It also contains functions for validtaing the user
input in the registration form.
**/
angular.module('moviez.register-factory', [])

.factory('RegisterFactory', RegisterFactory);

RegisterFactory.$inject = ['ApiBase', '$http'];

function RegisterFactory(ApiBase, $http) {
  const MIN_PASSWORD_LENGTH = 6;
  var service = {
    registerUser: registerUser,
    validateUsername: validateUsername,
    validateEmail: validateEmail,
    validatePassword: validatePassword
  };

  return service;

  function registerUser(user) {
    return $http.post(ApiBase + '/register', user);
  }

  function validateUsername(username) {
    /* TODO Check that username does not already exist */
    return username !== undefined && username.length > 4;
  }

  function validateEmail(email) {
    /* TODO Check that email does not already exist */
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function validatePassword(password, passwordRepeated) {
    return password !== undefined && password === passwordRepeated && password.length >= MIN_PASSWORD_LENGTH;
  }
}
