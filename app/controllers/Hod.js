'use strict';

angular.module('G1.Hod', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase'])

    .controller('HodCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', '$firebaseObject', '$firebaseArray', function ($route,$rootScope, $scope,$location,$http,$window,$filter,$firebaseObject,$firebaseArray) {

        (function initController() {

            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;


            getCourses();
            //
            // var Courses = firebase.database().ref().child("Courses");
            // Courses.on('value', function (datasnapshot) {
            //     $scope.Courses = datasnapshot.val();
            //     console.log($scope.Courses[1].title);
            //     // $scope.Courses.push({
            //     //     title: datasnapshot.child("title").val(),
            //     //     status: datasnapshot.child("status").val()
            //     // })
            // });


            $scope.currentTab = '';
            $scope.showGradeTable = true;
            $scope.NoRecommendation = true;


            $scope.Grades = [
                {Name:'Sam',
                Grade:'A+',
                Marks: 90,
                Recommendation:'test text test text test text test text test text'
                },
                {Name:'Tom',
                    Grade:'B+',
                    Marks: 83,
                    Recommendation:''},
                {Name:'Lee',
                    Grade:'Fail',
                    Marks: 39,
                    Recommendation:'test text test text test text test text test text'}
            ];
            $scope.editGradeForm = true;
            $scope.editGradeFormContent=[];


        })();


//Other Function------------------------------------------------------------------------------------------------------
        function getCourses() {
            //get the entire database tree
            const rootRef = firebase.database().ref();

            //zoom in to users table
            const ref = rootRef.child('Courses/ICT');
            //this allows us to use the array and the scope notation we are used to
            $scope.Courses = $firebaseArray(ref);
        }

        $scope.SaveGradeForm = function () {
            alert("Logic not done!")
        $scope.editGradeForm = $scope.editGradeForm === false ? true: false;
        }

        $scope.PublishGrades = function () {
            alert("Logic not done!")
        }

        $scope.toggleeditGradeForm = function(item) {
            $scope.editGradeForm = $scope.editGradeForm === false ? true: false;
            $scope.editGradeFormContent = item;
        };

        //Click on tab to change content
        $scope.onClickTab = function (tab) {
            $scope.currentTab = 'views/courseGrades.html';
            $scope.currentCourse = tab.title;
            $scope.currentCourseStatus = tab.status;
            $scope.showGradeTable = false;
            
            if ($scope.currentCourseStatus == 'Pending'){
                $scope.SelectedStatus = false;
            }
            else {
                $scope.SelectedStatus = true;
            }

        };
        $scope.isActiveTab = function(tabContent) {
            return tabContent == $scope.currentCourse;
        };

        $scope.checkRecommemdation = function (item) {
            if (item == ''){
                return true;
            }
        };

    }]);    //End of Dashboard controller
