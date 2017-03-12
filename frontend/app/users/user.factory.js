'use strict';

angular.module('moviez.user-factory', [])

.factory('UserFactory', UserFactory);

UserFactory.$inject = ['$http', 'ApiBase'];

function UserFactory($http, ApiBase) {
  var service = {
    getMe: getMe,
    getUser: getUser,
    getUserProfile: getUserProfile,
    editUserCredentials: editUserCredentials,
    editUserProfile: editUserProfile,
    updateUser: updateUser,
    getAllUsers: getAllUsers,
    searchUsers: searchUsers,
    getFollowedUsers: getFollowedUsers,
    followUser: followUser,
    unfollowUser: unfollowUser,
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

  function getUserProfile(username) {
    return $http.get(ApiBase + '/users/' + username + '/profile');
  }

  function editUserCredentials(username, email, password) {
    return $http.put(ApiBase + '/users/me', {
      email: email,
      username: username,
      password: password
    });
  }

  function editUserProfile(profileDescription) {
    return $http.put(ApiBase + '/profile', {
      text: profileDescription
    });
  }

  function getAllUsers(){
    return $http.get(ApiBase + '/users');
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
    return $http.put(ApiBase + '/following', {}, {
      params: {user: username}
    });
  }

  function unfollowUser(username){
    return $http.delete(ApiBase + '/following', {
      params: {user: username}
    });
  }

  function updateUser(user){
    console.log(user);
    for(var key in user) {
      service.userInfo[key] = user[key];
    }
  }
}
