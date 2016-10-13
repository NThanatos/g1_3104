/**
 * Created by DHINA on 9/28/2016.
 */
'use strict';

angular.module('G1.NewAccountCreation', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('NewAccountCreationCtrl', ['$route', '$rootScope', '$scope', '$firebaseObject', '$firebaseArray', '$location', '$http', '$window', '$filter', function ($route, $rootScope, $scope, $firebaseObject, $firebaseArray) {
        (function initController() {
            // $scope.currentUser=null;
            // $scope.currentUser.email = "";
            // $scope.currentUser.role = "";
            // $scope.currentUser.password = "";
            // $scope.currentUser.profile.address = "";
            // $scope.currentUser.profile.citizenship = "";
            // $scope.currentUser.profile.gender = "";
            // $scope.currentUser.profile.nok = "";
            // $scope.currentUser.profile.nokPhone = "";
            // $scope.currentUser.profile.phone = "";
            getInfo();


        })();
        function getInfo() {
            //get the entire database tree
            const rootRef = firebase.database().ref();

            //zoom in to users table
            const ref = rootRef.child('Users');
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
            alert()
            //get the entire database tree
            const rootRef = firebase.database().ref();

            //zoom in to users table
            const ref = rootRef.child('Users');

            var newRef = ref.push();
            newRef.set({
                name: info.name,
                email: info.email,
                role: info.role,
                password: info.password,
                profile: {
                    address: info.profile.address,
                    citizenship: info.profile.citizenship,
                    gender: info.profile.gender,
                    nok: info.profile.nok,
                    nokPhone: info.profile.nokPhone,
                    phone: info.profile.phone
                }

            });
            getInfo();
        };

    }]);