/**
 * Created by DHINA on 9/28/2016.
 */
'use strict';

angular.module('G1.AdminDashboard', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('AdminDashboardCtrl', ['$route', '$rootScope', '$scope', '$location', '$http', '$window', '$filter', function ($route, $rootScope, $scope, $location, $http, $window, $filter) {

        (function initController() {

            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;
        })();

//Other Function-------------------------------------------------------------------------------------------------------
        $scope.NewAccountClick = function () {
            $window.location.href = 'views/Admin//NewAccountCreation.html';
        }
//Other Function-------------------------------------------------------------------------------------------------------
        $scope.clickme = function () {
            alert("hit me");
        }

    }]);    //End of Dashboard controller
