'use strict';

angular.module('G1.Hod', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('HodCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', function ($route,$rootScope, $scope,$location,$http,$window,$filter) {

        (function initController() {

            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;
            $scope.Courses = [
                {title:'Programming Fundamentals', content:'views/courseGrades.html'},
                {title:'Intro to Software Engineering', content:'views/courseGrades.html'},
            ];

            $scope.currentTab = '';

            //Click on tab to change content
            $scope.onClickTab = function (tab) {
                $scope.currentTab = tab.content;
                $scope.currentCourse = tab.title;

            };
            $scope.isActiveTab = function(tabContent) {
                return tabContent == $scope.currentTab;
            };

            $scope.Grades = [
                {Name:'Sam',
                Grade:'A+'},
                {Name:'Tom',
                    Grade:'B+'},
                {Name:'Lee',
                    Grade:'Fail'}
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
