'use strict';

angular.module('G1.Create', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('CreateCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', function ($route,$rootScope, $scope,$location,$http,$window,$filter) {

        (function initController() {

            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;

            //Selection of tab content
            $scope.tabs = [
                { title:'Create Head of Department', content:'views/CreateHeadOfDepartment.html'},
                { title:'Create Lecturer', content:'views/CreateLecturer.html'},
                { title:'Create Student', content:'views/CreateStudent.html'}
            ];

            // default tab view
            $scope.currentTab = 'views/CreateHeadOfDepartment.html';

            //Click on tab to change content
            $scope.onClickTab = function (tab) {
                $scope.currentTab = tab.content;

            };
            $scope.isActiveTab = function(tabContent) {
                return tabContent == $scope.currentTab;
            };

        })();

//Other Function-------------------------------------------------------------------------------------------------------


    }]);    //End of Dashboard controller
