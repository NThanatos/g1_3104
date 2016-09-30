'use strict';

angular.module('G1.Hod', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('HodCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', function ($route,$rootScope, $scope,$location,$http,$window,$filter) {

        (function initController() {

            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;
            $scope.Courses = [
                {title:'course 111111111111111111 444444444', content:'views/courseGrades.html'},
                {title:'course 2', content:'views/courseGrades.html'},
            ];

            $scope.currentTab = '';

            //Click on tab to change content
            $scope.onClickTab = function (tab) {
                $scope.currentTab = tab.content;

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
            $scope.toggleeditGradeForm = function() {
                $scope.editGradeForm = $scope.editGradeForm === false ? true: false;
            };


        })();

//Other Function------------------------------------------------------------------------------------------------------

    }]);    //End of Dashboard controller
