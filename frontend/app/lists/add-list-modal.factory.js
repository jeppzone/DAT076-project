'use strict'

angular.module('moviez.add-list-modal', [])

.factory('AddListModal', AddListModal)

AddListModal.$inject = ['$uibModal'];

function AddListModal($uibModal) {
  var service = {
    showModal: showModal
  };

  return service;

  function showModal(movies, listTitle) {
    console.log('In controller');
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
        }
      }
    });

    return uibModalInstance;
    AddListModalController.$inject = ['$uibModalInstance', 'ListFactory', 'MovieFactory', '$scope', 'movies', 'listTile'];
    function AddListModalController($uibModalInstance, ListFactory, MovieFactory, $scope, movies, listTitle){
      var vm = this
      vm.save = save;
      vm.movies = [];
      vm.title = listTitle;
      //Copy the list so the contents are not changed automatically in the background
      vm.list = angular.copy(movies) || [];
      vm.posterBase = 'http://image.tmdb.org/t/p/w92';
      vm.models = {
        selected: null,
        lists: {'movies': vm.movies, "list": vm.list}
      };

      function save() {
        ListFactory.createList(vm.title, vm.description, getMovieIdsFromList())
        .then((result) => {
          console.log(result);
          $uibModalInstance.close(result);
        })
      }

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
