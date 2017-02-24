'use strict'

angular.module('moviez.user-factory', [])

.factory('UserFactory', UserFactory);

UserFactory.$inject = ['$http', 'ApiBase', 'LoginFactory'];

function UserFactory($http, ApiBase, LoginFactory) {
  var service = {
    getUser: getUser,
    updateUser: updateUser,
    userInfo: {}
  };

  return service;

  function getUser(){
    /*TODO Implement function go get user from API */
    return $http.get(ApiBase + '/user').then((result => {
      updateUser(result.data);
    }))
  }

  function updateUser(user){
    for(var key in user) {
      service.userInfo[key] = user[key];
    }
  }

}
