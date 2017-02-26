'use strict';

angular.module('moviez.home', [])

.config(homeConfig)
.controller('HomeController', HomeController);

homeConfig.$inject = ['$stateProvider'];
function homeConfig($stateProvider){
  $stateProvider.state('menu.home', {
    url: '/home',
    views: {
      'main':{
        templateUrl: '/home/home.view.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      }
    }
  });
}

HomeController.$inject = ['MovieFactory'];
function HomeController(MovieFactory){
  var vm = this;
  var posterBaseUrl =  'http://image.tmdb.org/t/p/w300';
  vm.popularMovies = [];
  MovieFactory.getPopularMovies().then((result) => {
    var movies = result.data.results;
    for(var i = 0; i < movies.length; i++){
      vm.popularMovies.push({title: movies[i].title, poster: posterBaseUrl + movies[i].poster_path});
    }
    console.log(vm.popularMovies);
  })
}
