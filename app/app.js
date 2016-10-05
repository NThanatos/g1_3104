'use strict';

// Declare app level module which depends on views, and components
angular.module('G1Project', [
    'ngRoute',
    'angularUtils.directives.dirPagination',
    '720kb.datepicker',
    'G1.Dashboard',
    'G1.Create'
])
   .controller('MainCtrl', function($scope, $http) {


       $scope.showLoading = false;
       $scope.LoadingTrue = function() {
           $scope.showLoading = true
       };
       $scope.LoadingFalse = function() {
           $scope.showLoading = false
       };
    })

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider

            .when('/Create', {
                templateUrl: 'views/Create.html',
                controller: 'CreateCtrl'
            })

            .when('/Dashboard', {
                templateUrl: 'views/Dashboard.html',
                controller: 'DashboardCtrl'
            })

            .when('/RegisterStudent',{
                templateUrl: 'views/CreateStudent.html',
                controller: 'RegisterStudent'
            })

            .when('/StudentDashboard',{
                templateUrl: 'views/StudentDashboard.html',
                controller: 'StudentDashboard'
            })

            .when('/StudentGrades',{
                templateUrl: 'views/StudentGrades.html',
                controller: 'StudentGrades'
            })
            .otherwise({redirectTo: '/Dashboard'});



    }]);


