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
    'G1.ModManagement',
    'G1.AdminDashboard',
    'G1.NewAccountCreation',
    'G1.NewCourseCreation',
    'G1.Hod',
    'G1.login',
    'G1.logout',
    'G1.Lecturer',
    'firebase',
    'G1.Student',
    'G1.profile',
    'G1.StudentDashboard',
    'ngStorage',
    'ngCookies',
    'mdo-angular-cryptography'

])
    .factory("myFactory", function () {
        var studData = '';
        var service = {};
        var savedData = '';
        var recommendData = '';

        var studrec = '';

        service.setData = function (student) {
            studData = student;
        };

        service.getData = function () {
            return studData;
        };

        service.setCrseModData = function (crsemod) {
            savedData = crsemod;
        };
        service.getCrseModData = function () {
            return savedData;
        };

        service.setstudent = function (stud) {
            studrec = stud;
        };
        service.getstudent = function () {
            return studrec;
        };

        service.setStudRecommend = function (recommend) {

            recommendData = recommend;
        };
        service.getStudRecommend = function () {

            return recommendData;
        };

        return service;

    })

    .controller('MainCtrl', function ($rootScope, $scope, $http, $firebaseObject, $cookies, $cookieStore, $localStorage,$crypto) {

        // $cookies.put('user', 'Nicholas');
        // var testCookie = $cookies.get('user');
        //alert(testCookie);
        $scope.menuSlider ='';
        if ($localStorage.credential != null) {
            $rootScope.userData = $localStorage.credential;
            $scope.menuSlider='views/menuslider.html'
        }


        $scope.showLoading = false;
        $scope.LoadingTrue = function () {
            $scope.showLoading = true
        };
        $scope.LoadingFalse = function () {
            $scope.showLoading = false
        };

        $scope.updateHidden = function (int) {

            if (int == 1) {
                $scope.hidemain = false;
                $scope.menuSlider='views/menuslider.html'

            } else {
                $scope.hidemain = true;
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


            .when('/RegisterStudent', {
                templateUrl: 'views/CreateStudent.html',
                controller: 'RegisterStudent'
            })

            .when('/StudentDashboard', {
                templateUrl: 'views/Student/StudentDashboard.html',
                controller: 'StudentDashboardCtrl'
            })

            .when('/StudentGrades', {
                templateUrl: 'views/Student/StudentGrades.html',
                controller: 'StudentCtrl' //cannot same name as another one on top ^
            })
            .when('/StudentEditProfile',{
                templateUrl: 'views/StudentEditProfile.html',
                controller: 'StudentCtrl' //cannot same name as another one on top ^
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
            .when('/NewCourseCreation', {
                templateUrl: 'views/Admin/NewCourseCreation.html',
                controller: 'NewCourseCreationCtrl'
            })

            //lecturer
            .when('/Lecturer', {
                templateUrl: 'views/Lecturer.html',
                controller: 'LecturerCtrl'
            })
            .when ('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'profileCtrl'
            })

            .when('/lect_viewStudentParticulars',{
                templateUrl: 'views/viewStudentParticulars.html',
                controller: 'LecturerCtrl'
            })

            .when('/lect_displayModAndCrse', {
                templateUrl: 'views/lect_displayModAndCrse.html',
                controller: 'LecturerCtrl'
            })

            .when('/viewIndivModule', {
                templateUrl: 'views/viewIndivModule.html',
                controller: 'LecturerCtrl'
            })

            .when('/lect_enterGrade', {
                templateUrl: 'views/lect_enterGrade.html',
                controller: 'LecturerCtrl'
            })

            .when('/addRecommendation', {
                templateUrl: 'views/addRecommendation.html',
                controller: 'LecturerCtrl'
            })
            .when('/ViewStudentGrades', {
                templateUrl: 'views/ViewStudentGrades.html',
                controller: 'LecturerCtrl'
            })
            .when('/changepassword', {
                templateUrl: 'views/changepassword.html',
                controller: 'loginCtrl'
            })
            .when('/Login', {
                /*url:'/inbox/25',*/
                templateUrl: 'views/login.html',
                controller: 'loginCtrl'
            })

            .when('/Logout', {
                template: 'views/logout.html', //A template or templateUrl is required by AngularJS, even if your controller always redirects.
                controller: 'logoutCtrl'
            })

            .when('/BackUpData', {
                templateUrl: 'views/Admin/BackUpData.html',
                controller: 'BackUpDataCtrl'
            })

            .when('/ModManagement', {
                templateUrl: 'views/Admin/ModManagement.html',
                controller: 'ModManagementCtrl'
            })
            .otherwise({redirectTo: '/Login'});


    }])
    .config(['$cryptoProvider', function ($cryptoProvider) {
        $cryptoProvider.setCryptographyKey('ABCD123');
    }]);


