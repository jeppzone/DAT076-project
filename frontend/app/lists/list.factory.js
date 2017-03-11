'use strict';
/**
  Module containing the list factory which is responsible for making all the requests
  to the backend regarding lists.
**/
angular.module('moviez.list-factory', [])

.factory('ListFactory', ListFactory);

ListFactory.$inject = ['ApiBase', '$http'];

function ListFactory(ApiBase, $http) {
  var service = {
    getAllLists: getAllLists,
    getListsFromFollowedUsers: getListsFromFollowedUsers,
    getListById: getListById,
    getListsByUser: getListsByUser,
    createList: createList,
    editList: editList,
    deleteList: deleteList
  };

  return service;

  /**
  Get all lists in the database
  *@param sortBy - Could be either 'date' or 'title'
  *@param sortOrder - Could be either 'asc' or 'desc'
  **/
  function getAllLists(sortBy, sortOrder) {
    return $http.get(ApiBase + '/lists', {
      params: {
        sortby: sortBy,
        sortorder: sortOrder
      }
    });
  }

  function getListsFromFollowedUsers() {
    return $http.get(ApiBase + '/lists/following');
  }

  function getListById(listId) {
    return $http.get(ApiBase + '/lists/' + listId);
  }

  function getListsByUser(username) {
    return $http.get(ApiBase + '/users/' + username + '/lists');
  }

  function createList(title, description, movies) {
    return $http.post(ApiBase + '/lists', {
      title: title,
      description: description,
      movies: movies
    });
  }

  function editList(listId, title, description, movies) {
    return $http.put(ApiBase + '/lists/' + listId, {
      title: title,
      description: description,
      movies: movies
    });
  }

  function deleteList(listId) {
    return $http.delete(ApiBase + '/lists/' +listId);
  }
}
