/**
 * Created by Winnie Lew on 10/16/2016.
 */

'use strict';

var app= angular.module('G1.Student', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('StudentCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', function ($route,$rootScope, $scope,$location,$http,$window,$filter,$firebaseObject,$firebaseArray) {

        //should retrieve the student key from login.js

        (function initController() {

            $scope.rotated = false;
            $scope.rotate = function() {
                $scope.rotated = !$scope.rotated;
            };

            $scope.NewsRotated = false;
            $scope.MyCourseRotated = false;

            $scope.hideSection = function() {
                $scope.MyCourseRotated = !$scope.MyCourseRotated;
            };
            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;


            $rootScope.transferTest = [];

            const rootRef = firebase.database().ref();
            $scope.resultsArray = [];


            //alert("root scope user data" + $rootScope.userData) //this is the child object from login.js

            for (var testkey in $rootScope.studentData) {
                alert("keyyyyy" + testkey);
                //$scope.userKey = testkey; //unique key of the user
                $scope.userKey = "KTxEMxrAYVSdtr0K1NH"

            }

            var coursesRef = rootRef.child('Courses')
            coursesRef.once('value', function (snapshot) {
                //alert("testing er")
                snapshot.forEach(function (moduleSnapshot) {
                    //alert("testing 2")
                    moduleSnapshot.forEach(function (moduleCodeSnapshot) {
                        moduleCodeSnapshot.forEach(function (moduleCode) {
                            moduleCode.forEach(function(userRole) {

                                userRole.forEach(function(userRole2){
                                        if(userRole2.key == $scope.userKey )
                                        {
                                            // alert("code " + moduleCode.key)

                                            $scope.moduleName = moduleCode.val().title;
                                            //$scope.studentName = userRole2.val().name;
                                            $scope.marks = userRole2.val().marks;
                                            //$scope.resultArray[modulePos].push($scope.marks)
                                            userRole2.forEach(function (recommendationSnap) {
                                                recommendationSnap.forEach(function (getMessage) {
                                                    $scope.moduleRecommendation = recommendationSnap.val().message;
                                                    // alert("MODULE RECOMMENDATION: " + $scope.moduleRecommendation)
                                                })
                                            })

                                            $scope.moduleCode = moduleCode.key //module code
                                            $scope.resultsArray.push({"Module_Name": $scope.moduleName,"Module_Code": $scope.moduleCode, "Marks" :$scope.marks,"Recommendation" :$scope.moduleRecommendation})
                                            console.log($scope.resultsArray, " array results")
                                        }

                                        //else
                                        //{
                                        //    alert("not")
                                        //}


                                    }

                                )


                            })

                        })


                    })
                })
                $rootScope.transferTest = $scope.resultsArray;
                console.log($rootScope.transferTest, " transferTest")


            })
        })();

//Other Function-------------------------------------------------------------------------------------------------------



    }])
    .directive("rotateFlip", function() {
        var first = true;
        return {
            restrict: "A",
            scope: {
                flag: "=rotateFlip"
            },
            link: function(scope, element) {
                scope.$watch("flag", function() {
                    _toggle(scope, element, !first);
                    first = false;
                });

                function _toggle(scope, element) {
                    element.toggleClass("rotated", scope.flag);
                }
            }
        }
    });

