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


            $scope.AddCourse = function (coursename) {

                //get the entire database tree
                const rootRef = firebase.database().ref();



                //make sure does not exist b4 create
                rootRef.child('Courses/'+coursename).once('value', function(snapshot) {
                    var exists = (snapshot.val() !== null);
                    if(!exists){
                        //run some code
                        const ref = rootRef.child('Courses/'+coursename).set({
                            hod: ''}
                        )
                        alert("Course Already Exist");
                    }
                });



                getInfo();
            };


        }]);