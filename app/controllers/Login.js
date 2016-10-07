/**
 * Created by PorYee on 2/10/2016.
 */
'use strict';

angular.module('G1.login', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/Login', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        });

    }])

    .controller('loginCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {


        //get the entire database tree
        const rootRef=firebase.database().ref();

        //zoom in to users table
        const ref = rootRef.child('testUsers');

        //noticed that object is suitable for json
        this.userobj = $firebaseObject(ref);

        //this allows us to use the array and the scope notation we are used to
        $scope.usertable = $firebaseArray(ref);

        $scope.login = function() {

            /*firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
             // Handle Errors here.
             var errorCode = error.code;
             var errorMessage = error.message;
             console.log(errorCode);
             console.log(errorMessage);
             alert(errorCode);
             alert(errorMessage);
             });*/
            var list = $firebaseArray(ref);
            var rec = list.$getRecord("foo");


            var user =ref.orderByChild("email");
            console.log(user);

            alert("Welcome "+$scope.email);
            $scope.hidelogin=true;
            $scope.hidemain=false;
        }

    }]);

