'use strict';

angular.module('moviez.list-factory', [])

.factory('ListFactory', ListFactory);

ListFactory.$inject = ['ApiBase', '$http'];

function ListFactory(ApiBase, $http) {
  var service = {
    getAllLists: getAllLists,
    getListById: getListById,
    getListsByUser: getListsByUser,
    createList: createList,
    editList: editList,
    deleteList: deleteList
  };

  return service;

  function getAllLists(sortBy, sortOrder) {
    return $http.get(ApiBase + '/lists', {
      params: {
        sortby: sortBy,
        sortorder: sortOrder
      }
    });
  }

  function getListById(listId){
    return $http.get(ApiBase + '/lists/' + listId);
  }

  function getListsByUser(username) {
    return $http.get(ApiBase + '/users/' + username + '/lists');
  }

  function createList(title, description, movies) {
    console.log(title);
    console.log(description);
    console.log(movies);
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
