/**
 * Created by Winnie Lew on 10/16/2016.
 */

'use strict';

angular.module('G1.Student', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('StudentCtrl', ['$route', '$rootScope', '$scope', '$location', '$http', '$window', '$filter', '$crypto',
        function ($route, $rootScope, $scope, $location, $http, $window, $filter, $crypto) {

            //should retrieve the student key from login.js

            (function initController() {

                //temp var for holding total gpa points
                $scope.currenttotalGPApoints = 0;
                //temp var for holding total credit hour
                $scope.totalcredithour = 0;
                $scope.rotated = false;
                $scope.rotate = function () {
                    $scope.rotated = !$scope.rotated;
                };

                $scope.NewsRotated = false;
                $scope.MyCourseRotated = false;

                $scope.hideSection = function () {
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
                    //alert("keyyyyy" + testkey);
                    //$scope.userKey = testkey; //unique key of the user
                    $scope.userKey = "KTxEMxrAYVSdtr0K1NH"

                }


                var coursesRef = rootRef.child('Courses')
                coursesRef.once('value', function (snapshot) {
                    snapshot.forEach(function (moduleSnapshot) {
                        moduleSnapshot.forEach(function (moduleCodeSnapshot) {

                            moduleCodeSnapshot.forEach(function (moduleCode) {
                                moduleCode.forEach(function (userRole) {

                                    userRole.forEach(function (userRole2) {
                                            if (userRole2.key == $scope.userKey && moduleCode.val().status == "Published") {

                                                $scope.moduleName = moduleCode.val().title;
                                                //get the grade according to the marks given
                                                $scope.grades = getGrade(userRole2.val().marks);

                                                //find the grade point for the grade
                                                $scope.gpagradepoint = getGPAgradepoints($scope.grades);
                                                //sum total gradepoints so far
                                                $scope.currenttotalGPApoints = $scope.currenttotalGPApoints + ($scope.gpagradepoint * 5);
                                                //sum total credit hours
                                                $scope.totalcredithour += 5;
                                                //calculate gpa
                                                $scope.gpa = $scope.currenttotalGPApoints / $scope.totalcredithour;
                                                //encrypt gpa and put to firebase
                                                encryptGPAandSendtoFirebase($scope.userKey, $scope.gpa);

                                                $scope.moduleCode = moduleCode.key //module code
                                                $scope.resultsArray.push({
                                                    "Module_Name": $scope.moduleName,
                                                    "Module_Code": $scope.moduleCode,
                                                    "Grades": $scope.grades,
                                                    "Credit_Units": 5
                                                    // "Recommendation": $scope.moduleRecommendation
                                                })
                                                console.log($scope.resultsArray, " array results")
                                            }

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
            function getGrade(mark) {

                if (mark > 85) {
                    return 'A';
                }
                else if (mark > 70) {
                    return 'B';
                }
                else if (mark > 60) {
                    return 'C';
                }
                else if (mark > 50) {
                    return 'D';
                }
                else {
                    return 'Fail';
                }
            };
            function getGPAgradepoints(grade) {
                if (grade == 'A') {
                    return 5;
                }
                else if (grade == 'B') {
                    return 4;
                }
                else if (grade == 'C') {
                    return 3;
                }
                else if (grade == 'D') {
                    return 2;
                }
                else {
                    return 1;
                }
            };

            function encryptGPAandSendtoFirebase(userkey, gpa) {

                var encryptedgpa = $crypto.encrypt(gpa.toString());
                var decryptedgpa = $crypto.decrypt(encryptedgpa);
                const rootRef = firebase.database().ref();
                var hyphen = "-";
                var fullUserKey =hyphen.concat(userkey);
                //zoom in to users table
                const ref = rootRef.child('Users');
                ref.child(fullUserKey).update({
                    gpa: encryptedgpa
                });
            };
        }])
// .directive("rotateFlip", function () {
//     var first = true;
//     return {
//         restrict: "A",
//         scope: {
//             flag: "=rotateFlip"
//         },
//         link: function (scope, element) {
//             scope.$watch("flag", function () {
//                 _toggle(scope, element, !first);
//                 first = false;
//             });
//
//             function _toggle(scope, element) {
//                 element.toggleClass("rotated", scope.flag);
//             }
//         }
//     }
// });

