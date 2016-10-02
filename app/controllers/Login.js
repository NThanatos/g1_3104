/**
 * Created by PorYee on 2/10/2016.
 */
'use strict';

angular.module('G1.login', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        });

    }])

    .controller('loginCtrl', ['$scope', function($scope) {

        $scope.login = function(){
            firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);

            });
            alert("Welcome "+$scope.email);
        }

    }]);

