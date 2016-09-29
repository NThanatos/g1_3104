/**
 * Created by DHINA on 9/28/2016.
 */
'use strict';

angular.module('G1.NewAccountCreation', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('NewAccountCreationCtrl', ['$route', '$rootScope', '$scope', '$location', '$http', '$window', '$filter', function ($route, $rootScope, $scope, $location, $http, $window, $filter) {

        (function initController() {

            getInfo();
            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;
        })();
        function getInfo() {
            $http.get('http://localhost:81/students.php')
                .success(function(data) {
                    $scope.details = data;
            });
        }

    }]);