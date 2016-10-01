/**
 * Created by Lee Hui Qi on 27/9/2016.
 */

'use strict';

angular.module('G1.Lecturer', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('LecturerCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', function ($route,$rootScope, $scope,$location,$http,$window,$filter) {

        (function initController() {

            //click link to respective view
            $scope.changeView = function(view){
                $location.path(view);
            };


        })();

//Other Function-------------------------------------------------------------------------------------------------------


    }]);    //End of Lecturer controller