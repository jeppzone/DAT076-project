'use strict';

/**
 Module responsible for controlling the modal where lists can be added and edited.
**/
angular.module('moviez.add-list-modal', [])

.factory('AddListModal', AddListModal);

AddListModal.$inject = ['$uibModal'];

function AddListModal($uibModal) {
  var service = {
    showModal: showModal
  };

  return service;

  function showModal(movies, listTitle, listId, editing) {
    var uibModalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      templateUrl: 'lists/add-list-modal.view.html',
      controller: AddListModalController,
      controllerAs: 'vm',
      resolve: {
        movies: function() {
          return movies;
        },
        listTitle: function() {
          return listTitle;
        },
        listId: function() {
          return listId;
        },
        editing: function() {
          return editing;
        }
      }
    });

    return uibModalInstance;
    AddListModalController.$inject = ['$uibModalInstance', 'ListFactory', 'MovieFactory', '$scope', 'movies', 'listTile', 'listId', 'editing'];
    function AddListModalController($uibModalInstance, ListFactory, MovieFactory, $scope, movies, listTitle, listId, editing){
      var vm = this;
      vm.save = save;
      vm.movies = [];
      vm.title = listTitle;
      //Copy the list so the contents are not changed automatically in the background
      vm.list = angular.copy(movies) || [];
      vm.listId = listId;
      vm.posterBase = 'http://image.tmdb.org/t/p/w92';
      vm.models = {
        selected: null,
        lists: {'movies': vm.movies, "list": vm.list}
      };

      function save() {
        if(editing){
          ListFactory.editList(vm.listId, vm.title, vm.description, getMovieIdsFromList()).then((result) => {
            $uibModalInstance.close(result);
          });
        }else{
          ListFactory.createList(vm.title, vm.description, getMovieIdsFromList())
          .then((result) => {
            $uibModalInstance.close(result);
          });
        }
      }

      /* Watch to see if the searchString is changed. If a movie in the search result
      is already in the list, remove it from the search result to avoid duplicates
      */
      $scope.$watch('vm.searchString', (newValue) => {
        if(newValue){
          MovieFactory.searchMovie(newValue).then((result) => {
            vm.movies = result.data.results;
            vm.list.forEach((selectedMovie) => {
              vm.movies.forEach((searchResult) => {
                if(selectedMovie.id === searchResult.id){
                  vm.movies.splice(vm.movies.indexOf(searchResult), 1);
                }
              });
            });
          });
        }else{
          vm.movies = [];
        }
      });

      /* The backend only wants an array of TMDB IDs, therefore we loop through
      the list and create an array of TMDB IDs to send to the backend */
      function getMovieIdsFromList() {
        var idArray = [];
        vm.list.forEach(function(movie){
          idArray.push(movie.id);
        });
        return idArray;
      }
    }
  }
}
