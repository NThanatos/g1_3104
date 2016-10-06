/**
 * Created by Winnie Lew on 9/28/2016.
 */


'use strict';

angular.module('G1.Student', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('StudentCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', function ($route,$rootScope, $scope,$location,$http,$window,$filter) {

        (function initController() {

            $scope.changePage = function(view){
                //alert("test");
                $location.path(view);

            };

        })();

    }]);


    //.config(function($mdThemingProvider) {
    //    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    //    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    //    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    //    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    //});