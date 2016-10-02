'use strict';

// Declare app level module which depends on views, and components
angular.module('G1Project', [
    'ngRoute',
    'angularUtils.directives.dirPagination',
    '720kb.datepicker',
    'G1.Dashboard',
    'G1.Create',
    'G1.AdminDashboard',
    'G1.NewAccountCreation',
    'G1.Hod',
    'G1.Lecturer'
])
   .controller('MainCtrl', function($scope, $http) {


       $scope.showLoading = false;
       $scope.LoadingTrue = function() {
           $scope.showLoading = true
       };
       $scope.LoadingFalse = function() {
           $scope.showLoading = false
       };

       var config = {
           apiKey: "AIzaSyBCagtKLDBADDPwGVeqZg56iir2opfFF1o",
           authDomain: "ict3104.firebaseapp.com",
           databaseURL: "https://ict3104.firebaseio.com",
           storageBucket: "ict3104.appspot.com",
           messagingSenderId: "33658218550"
       };
       firebase.initializeApp(config);

    })

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider

            .when('/Create', {
                templateUrl: 'views/Create.html',
                controller: 'CreateCtrl'
            })

            .when('/Hod', {
                templateUrl: 'views/Hod.html',
                controller: 'HodCtrl'
            })

            .when('/Dashboard', {
                templateUrl: 'views/Dashboard.html',
                controller: 'DashboardCtrl'
            })
            .when('/AdminDashboard', {
                templateUrl: 'views/Admin/AdminDashboard.html',
                controller: 'AdminDashboardCtrl'
            })
            .when('/NewAccountCreation', {
                templateUrl: 'views/Admin/NewAccountCreation.html',
                controller: 'NewAccountCreationCtrl'
            })
            .when ('/Lecturer', {
                templateUrl: 'views/Lecturer.html',
                controller: 'LecturerCtrl'
            })

            .when('/modulesGrades_Lect', {
                templateUrl: 'views/modulesGrades_Lect.html',
                controller: 'LecturerCtrl'
            })

            .when('/recommendation', {
                templateUrl: 'views/recommendation.html',
                controller: 'LecturerCtrl'
            })

            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({redirectTo: '/login'});




    }]);


