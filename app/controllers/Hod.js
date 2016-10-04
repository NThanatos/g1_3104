'use strict';

angular.module('G1.Hod', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase'])

    .controller('HodCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', function ($route,$rootScope, $scope,$location,$http,$window,$filter) {

        (function initController() {

            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;

             // $scope.Courses=[{title:'Loading', content:'views/courseGrades.html', status:'t'}];

            $scope.Courses = [
                {title:'Intro to Software Engineering', status:'Pending'},
                {title:'Programming Fundamentals',  status:'Published'}
            ];

             var Courses = firebase.database().ref().child("Courses");
            Courses.on('value', function (datasnapshot) {
                $scope.Courses = datasnapshot.val();
                console.log($scope.Courses[1].title);
                // $scope.Courses.push({
                //     title: datasnapshot.child("title").val(),
                //     status: datasnapshot.child("status").val()
                // })
            });







            $scope.currentTab = '';
            //Click on tab to change content
            $scope.onClickTab = function (tab) {
                $scope.currentTab = 'views/courseGrades.html';
                $scope.currentCourse = tab.title;
                $scope.currentCourseStatus = tab.status;

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
            console.log($scope.Courses[1].title);


            $scope.Grades = [
                {Name:'Sam',
                Grade:'A+',
                Marks: 90},
                {Name:'Tom',
                    Grade:'B+',
                    Marks: 83},
                {Name:'Lee',
                    Grade:'Fail',
                    Marks: 39}
            ];
            $scope.editGradeForm = true;
            $scope.editGradeFormContent=[];


        })();

//Other Function------------------------------------------------------------------------------------------------------
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


    }]);    //End of Dashboard controller
