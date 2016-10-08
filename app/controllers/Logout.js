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

    .controller('logoutCtrl', ['$rootScope', '$scope', '$firebaseObject', '$firebaseArray', '$location', function ($rootScope, $scope, $firebaseObject, $firebaseArray, $location) {

        //clear user data and redirect to main in this case login
        $rootScope.userData=null;
        $location.path('/');


    }]);
