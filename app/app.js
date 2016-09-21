'use strict';

// Declare app level module which depends on views, and components
angular.module('G1Project', [
    'ngRoute',
    'angularUtils.directives.dirPagination',
    '720kb.datepicker',
    'Scrappy.Dashboard'
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

            .when('/Dashboard', {
                templateUrl: 'views/Dashboard.html',
                controller: 'DashboardCtrl'
            })

            .otherwise({redirectTo: '/Dashboard'});

    }]);


