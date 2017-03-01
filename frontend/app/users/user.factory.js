'use strict';

angular.module('moviez.user-factory', [])

.factory('UserFactory', UserFactory);

UserFactory.$inject = ['$http', 'ApiBase'];

function UserFactory($http, ApiBase) {
  var service = {
    verifyUser: verifyUser,
    updateUser: updateUser,
    userInfo: {},
    loggedIn: false
  };

  return service;

  function verifyUser(){
    return $http.get(ApiBase + '/profile').then((result) => {
      updateUser(result.data.user);
      if(service.userInfo.username){
        service.loggedIn = true;
      }
    });
  }

  /*
  function editUser() {
    return $http.put(ApiBase + '/profile', )
  }*/

  function updateUser(user){
    for(var key in user) {
      service.userInfo[key] = user[key];
    }
  }

}
