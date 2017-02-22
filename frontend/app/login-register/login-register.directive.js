'use strict'

angular.module('moviez.login-register', [])

.directive('loginRegister', LoginRegister);

function LoginRegister() {
  var directive = {
    restrict: 'E',
    templateUrl: 'login-register/login-register.view.html',
    controller: 'LoginRegisterCtrl',
    controllerAs: 'vm'
  }

  return directive;
}
