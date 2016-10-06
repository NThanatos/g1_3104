/**
 * Created by DHINA on 9/28/2016.
 */
'use strict';

angular.module('G1.BackUpData', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('BackUpDataCtrl', ['$route', '$rootScope', '$scope', '$location', '$http', '$window', '$filter', function ($route, $rootScope, $scope, $location, $http, $window, $filter) {

        (function initController() {

        })();

//Other Function-------------------------------------------------------------------------------------------------------

//Other Function-------------------------------------------------------------------------------------------------------
        $scope.backup = function () {
            alert("data downloaded");
        }

    }]);    //End of Dashboard controller

