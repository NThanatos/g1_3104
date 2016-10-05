/**
 * Created by Winnie Lew on 9/28/2016.
 */
'use strict';

angular.module('G1.StudentGrades', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('StudentGradesCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', function ($route,$rootScope, $scope,$location,$http,$window,$filter) {

        (function initController() {

            $scope.rotated = false;
            $scope.rotate = function() {
                $scope.rotated = !$scope.rotated;
            };

            $scope.NewsRotated = false;
            $scope.MyCourseRotated = false;

            $scope.hideSection = function() {
                $scope.MyCourseRotated = !$scope.MyCourseRotated;
            };
            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;

        })();

//Other Function-------------------------------------------------------------------------------------------------------



    }])
    .directive("rotateFlip", function() {
        var first = true;
        return {
            restrict: "A",
            scope: {
                flag: "=rotateFlip"
            },
            link: function(scope, element) {
                scope.$watch("flag", function() {
                    _toggle(scope, element, !first);
                    first = false;
                });

                function _toggle(scope, element) {
                    element.toggleClass("rotated", scope.flag);
                }
            }
        }
    });
//End of Dashboard controller
