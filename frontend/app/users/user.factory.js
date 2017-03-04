'use strict';

angular.module('moviez.user-factory', [])

.factory('UserFactory', UserFactory);

UserFactory.$inject = ['$http', 'ApiBase'];

function UserFactory($http, ApiBase) {
  var service = {
    getMe: getMe,
    getUser: getUser,
    getUserProfile: getUserProfile,
    updateUser: updateUser,
    getAllUsers: getAllUsers,
    searchUsers: searchUsers,
    getFollowedUsers: getFollowedUsers,
    followUser: followUser,
    unFollowUser: unFollowUser,
    userInfo: {},
    loggedIn: false
  };

  return service;

  function getMe() {
    return $http.get(ApiBase + '/profile');
  }

  function getUser(username) {
    return $http.get(ApiBase + '/users/' + username);
  }

  function getUserProfile(username){
    return $http.get(ApiBase + '/users/' + username + '/profile');
  }

  /*
  function editUser() {
    return $http.put(ApiBase + '/profile')
  }*/

  function updateUser(user){
    for(var key in user) {
      service.userInfo[key] = user[key];
    }
  }

  function getAllUsers(){
    return $http.get(ApiBase + '/users/all');
  }

  function searchUsers(searchString){
    return $http.get(ApiBase + '/users', {
      params: {search: searchString}
    });
  }

  function getFollowedUsers(){
    return $http.get(ApiBase + '/following');
  }

  function followUser(username){
    return $http.put(ApiBase + '/following', {
      params: {user: username}
    });
  }

  function unFollowUser(username){
    return $http.delete(ApiBase + '/following', {
      params: {user: username}
    });
  }

}
