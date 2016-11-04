/**
 * Created by PorYee on 8/10/2016.
 */

angular.module('G1.logout', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Logout', {
            templateUrl: 'views/logout.html',
            controller: 'LogoutCtrl'
        });
    }])

    .controller('logoutCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$location', '$localStorage', function ($scope, $firebaseObject, $firebaseArray, $location, $localStorage) {

        //clear user data and redirect to main in this case login
        //$rootScope.userData=null;
        $localStorage.credential=null;
        $localStorage.userid=null;
        $localStorage.studentCredential=null;
        $location.path('/');


    }]);
