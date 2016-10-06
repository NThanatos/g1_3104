/**
 * Created by DHINA on 9/28/2016.
 */
'use strict';

angular.module('G1.NewAccountCreation', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('NewAccountCreationCtrl', ['$route', '$rootScope', '$scope', '$firebaseObject', '$firebaseArray', '$location', '$http', '$window', '$filter', function ($route, $rootScope, $scope, $firebaseObject, $firebaseArray) {

        (function initController() {

            getInfo();
            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;
        })();
        function getInfo() {
            //get the entire database tree
            const rootRef = firebase.database().ref();

            //zoom in to users table
            const ref = rootRef.child('testUsers');
            //this allows us to use the array and the scope notation we are used to
            $scope.details = $firebaseArray(ref);
        }

        $scope.viewEditForm = true;
        $scope.viewAddForm = true;

        $scope.editInfo = function (info) {
            $scope.currentUser = info;

            $scope.viewEditForm = $scope.viewEditForm === false ? true : false;
        };


        $scope.UpdateInfo = function (info) {
            $scope.viewEditForm = false;
            //get the entire database tree
            const rootRef = firebase.database().ref();

            //zoom in to users table
            const ref = rootRef.child('testUsers');
            ref.child(info.$id).update({

                name: info.name,
                email: info.email,
                role: info.role
            });
            getInfo();
            $scope.editInfo(info);
        };
        $scope.deleteInfo = function (info) {
            //get the entire database tree
            const rootRef = firebase.database().ref();

            //zoom in to users table
            const ref = rootRef.child('testUsers');
            ref.child(info.$id).remove();
            getInfo();
        };

        $scope.AddInfo = function (info) {
            //get the entire database tree
            const rootRef = firebase.database().ref();

            //zoom in to users table
            const ref = rootRef.child('testUsers');

            var newRef = ref.push();
            newRef.set({
                name: info.name,
                email: info.email,
                role: info.role
            });
            $scope.addForm();
            getInfo();
        };

        $scope.addForm = function () {

            $scope.viewAddForm = $scope.viewAddForm === false ? true : false;
        }

    }]);