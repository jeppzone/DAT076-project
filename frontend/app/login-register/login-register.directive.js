'use strict';

angular.module('moviez.login-register', [])

.directive('loginRegister', LoginRegister)
.controller('LoginRegisterCtrl', LoginRegisterCtrl);

function LoginRegister(){
  var directive = {
    restrict: 'E',
    templateUrl: 'login-register/login-register.view.html',
    controller: 'LoginRegisterCtrl',
    controllerAs: 'vm'
  };

  return directive;
}

LoginRegisterCtrl.$inject = ['loginRegisterModal', 'LoginFactory'];
function LoginRegisterCtrl(loginRegisterModal, LoginFactory){
  var vm = this;

  vm.openLoginModal = openLoginModal;
  vm.logOut = logOut;

  function openLoginModal(){
    loginRegisterModal.showModal();
  }

  function logOut() {
    LoginFactory.clearCredentials();
  }
}
