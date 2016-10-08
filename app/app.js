'use strict';

var config = {
    apiKey: "AIzaSyBCagtKLDBADDPwGVeqZg56iir2opfFF1o",
    authDomain: "ict3104.firebaseapp.com",
    databaseURL: "https://ict3104.firebaseio.com",
    storageBucket: "ict3104.appspot.com",
    messagingSenderId: "33658218550"
};
firebase.initializeApp(config);

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
    'G1.login',
    'G1.Lecturer',
    'firebase',
    'G1.Student',

    'ngCookies'

])
   .controller('MainCtrl', function($scope, $http, $firebaseObject, $cookies, $cookieStore) {

       $cookies.put('user', 'Nicholas');
       var testCookie = $cookies.get('user');

       //alert(testCookie);
       

       $scope.showLoading = false;
       $scope.LoadingTrue = function() {
           $scope.showLoading = true
       };
       $scope.LoadingFalse = function() {
           $scope.showLoading = false
       };

       $scope.updateHidden=function(int)  {

           if(int==1){
               $scope.hidemain=false;
               $scope.hidelogin=true;
           }else{
               $scope.hidemain=true;
               $scope.hidelogin=false;
           }

       }
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


            .when('/RegisterStudent',{
                templateUrl: 'views/CreateStudent.html',
                controller: 'RegisterStudent'
            })

            .when('/StudentDashboard',{
                templateUrl: 'views/StudentDashboard.html',
                controller: 'StudentCtrl'
            })

            .when('/StudentGrades',{
                templateUrl: 'views/StudentGrades.html',
                controller: 'Studentasd' //cannot same name as another one on top ^
            })
            .otherwise({redirectTo: '/Dashboard'})

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

            .when('/editgrade_lect', {
                templateUrl: 'views/editgrade_lect.html',
                controller: 'LecturerCtrl'
            })

            .when('/recommendation', {
                templateUrl: 'views/recommendation.html',
                controller: 'LecturerCtrl'
            })

            .when('/addRecommendation', {
                templateUrl: 'views/addRecommendation.html',
                controller: 'LecturerCtrl'
            })

            .when('/login', {
                /*url:'/inbox/25',*/
                templateUrl: 'views/login.html',
                controller: 'loginCtrl'
            })
            .when('/BackUpData', {
                templateUrl: 'views/Admin/BackUpData.html',
                controller: 'BackUpDataCtrl'
            })
            .otherwise({redirectTo: '/login'});



    }]);


