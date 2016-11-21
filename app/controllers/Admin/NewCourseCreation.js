'use strict';

angular.module('G1.NewCourseCreation', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('NewCourseCreationCtrl', ['$route', '$rootScope', '$scope', '$firebaseObject', '$firebaseArray', '$location', '$http', '$window', '$filter', '$crypto',
        function ($route, $rootScope, $scope, $firebaseObject, $firebaseArray, $location, $http, $window, $filter, $crypto) {

            (function initController() {
                getInfo();
            })();
            
            function getInfo() {
                //get the entire database tree
                const rootRef = firebase.database().ref();

                //zoom in to users table
                const ref = rootRef.child('Courses');
                //this allows us to use the array and the scope notation we are used to
                $scope.details = $firebaseArray(ref);
                $scope.moduledetail=$firebaseArray(ref.orderByChild("modules"));

                $scope.ModuleList = [];

                ref.orderByChild("modules").once("value", function(snap){
                    snap.forEach(function (childSnap) {
                        childSnap.forEach(function (modSnap){

                            if(modSnap.key=="modules"){
                                modSnap.forEach(function (modChild){
                                    $scope.ModuleList.push({key:modChild.key,value: modChild.val()});
                                })
                            }

                        });
                        //$scope.ModuleList.push(childSnap.val());

                    });
                });
                console.log($scope.ModuleList);

            }



            $scope.UpdateInfo = function (info) {
                $scope.viewEditForm = false;
                //get the entire database tree
                const rootRef = firebase.database().ref();

                //zoom in to users table
                const ref = rootRef.child('Users');

                if (info.role == 'student') {
                    ref.child(info.$id).update({
                        name: info.name,
                        email: info.email,
                        role: info.role,
                        accountStatus: "Activated",
                        yearJoined: info.yearJoined,
                        password: info.password,
                        passwordChangedDate: currentDate,
                        gpa: 0.00,
                        profile: {
                            address: info.profile.address,
                            citizenship: info.profile.citizenship,
                            gender: info.profile.gender,
                            nok: info.profile.nok,
                            nokPhone: info.profile.nokPhone,
                            phone: info.profile.phone
                        }

                    });
                }
                else {
                    ref.child(info.$id).update({
                        accountStatus: "Activated",
                        name: info.name,
                        email: info.email,
                        role: info.role,

                        password: info.password,
                        passwordChangedDate: currentDate,
                        profile: {
                            address: info.profile.address,
                            citizenship: info.profile.citizenship,
                            gender: info.profile.gender,
                            nok: info.profile.nok,
                            nokPhone: info.profile.nokPhone,
                            phone: info.profile.phone
                        }

                    });
                }


                getInfo();
                $scope.editInfo(info);
            };
            $scope.deleteInfo = function (info) {
                //get the entire database tree
                const rootRef = firebase.database().ref();

                //zoom in to users table
                const ref = rootRef.child('Users');
                ref.child(info.$id).remove();
                getInfo();
            };

            $scope.AddInfo = function (info) {
                var currentDate = $filter('date')(new Date(), 'dd/MM/yyyy'); //for lastchangepassword field

                //get the entire database tree
                const rootRef = firebase.database().ref();

                //zoom in to users table
                const ref = rootRef.child('Users');
                var newRef = ref.push();
                if (info.role == 'student') {
                    newRef.set({
                        accountStatus: "Activated",
                        name: info.name,
                        email: info.email,
                        role: info.role,
                        yearJoined: info.yearJoined,
                        password: info.password,
                        passwordChangedDate: currentDate,
                        gpa: 0.00,
                        profile: {
                            address: info.profile.address,
                            citizenship: info.profile.citizenship,
                            gender: info.profile.gender,
                            nok: info.profile.nok,
                            nokPhone: info.profile.nokPhone,
                            phone: info.profile.phone
                        }

                    });
                }
                else {
                    newRef.set({
                        accountStatus: "Activated",
                        name: info.name,
                        email: info.email,
                        role: info.role,

                        password: info.password,
                        passwordChangedDate: currentDate,
                        profile: {
                            address: info.profile.address,
                            citizenship: info.profile.citizenship,
                            gender: info.profile.gender,
                            nok: info.profile.nok,
                            nokPhone: info.profile.nokPhone,
                            phone: info.profile.phone
                        }

                    });
                }


                getInfo();
            };


        }]);