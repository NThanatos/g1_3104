/*  NOTE: In js, all functions are executed in one go without waiting for any function's completion.
          Hence, if conditions are needed in the event where one function has to finish executing
          before starting the second function. */

/**
 *  This is the main page of the website and the controller of Dashboard.html.
 *  This controller contains functions for displaying all records in the db, search function and compare function.
 *  It also contains function that leads users to the individual record page, which is ViewRecord.html
 * */


'use strict';

angular.module('Scrappy.Dashboard', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('DashboardCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', function ($route,$rootScope, $scope,$location,$http,$window,$filter) {

        (function initController() {

            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;


        })();

//Other Function-------------------------------------------------------------------------------------------------------


    }]);    //End of Dashboard controller
