'use strict';

angular.module('moviez.user-factory', [])

.factory('UserFactory', UserFactory);

UserFactory.$inject = ['$http', 'ApiBase'];

function UserFactory($http, ApiBase) {
  var service = {
    getUser: getUser,
    updateUser: updateUser,
    userInfo: {},
    loggedIn: false
  };

  return service;

  function getUser(){
    /*TODO Uncomment this when backend function implemented */
    //return $http.get(ApiBase + '/user').then((result) => {
      //updateUser(result.data);
    //});
  }

  function updateUser(user){
    for(var key in user) {
      service.userInfo[key] = user[key];
    }
  }

}
