/**
 * Created by Lee Hui Qi on 27/9/2016.
 */

'use strict';

angular.module('G1.Lecturer', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('LecturerCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', function ($route,$rootScope, $scope,$location,$http,$window,$filter) {

        (function initController() {

            //testing data
            $scope.dataResult =
                [
                    {
                        "id": "1qddw",
                        "course": "ICT",
                        "module": "ICT1001",
                        "student":
                            [
                                {"Name": "John", "Age": 21, "grade": "A", "marks": 80, "recommendation": "hello"},
                                {"Name": "Mary", "Age": 22, "grade": "B", "marks": 70, "recommendation": null}
                            ],
                        "lecturer":
                            [
                                {"Name": "prof1"},
                                {"Name": "prof3"}
                            ],
                        "hod":
                            [
                                {"Name": "hod1"}
                            ],
                        "status": "freeze"
                    },
                    {
                        "id": "2scsa",
                        "course": "ICT",
                        "module": "ICT3104",
                        "student":
                            [
                                {"Name": "Jason", "Age": 21, "grade": null, "marks": null},
                                {"Name": "June", "Age": 22, "grade": null, "marks": null}
                            ],
                        "lecturer":
                            [
                                {"Name": "prof2"},
                                {"Name": "prof7"}
                            ],
                        "hod":
                            [
                                {"Name": "hod2"}
                            ],
                        "status": "new"
                    },
                    {
                        "id": "3abc",
                        "course": "ACC",
                        "module": "ACC2001",
                        "student":
                            [
                                {"Name": "Peter", "Age": 21, "grade": "B", "marks": 70},
                                {"Name": "Noi", "Age": 22, "grade": "C", "marks": 60}
                            ],
                        "lecturer":
                            [
                                {"Name": "prof1"},
                                {"Name": "prof2"}
                            ],
                        "hod":
                            [
                                {"Name": "hod7"}
                            ],
                        "status": "freeze"
                    }
                ];

            //transform the data
            $scope.dataResultTransformed = [];
            $scope.courses = [];
            $scope.modules = [];
            $scope.dataResult.forEach(function(cs){
                cs.student.forEach(function(g){
                    $scope.dataResultTransformed.push({
                        id: cs.id,
                        coursename: cs.course,
                        modulename: cs.module,
                        stuname: g.Name,
                        stugrade: g.grade,
                        stumarks: g.marks,
                        publishstatus: cs.status
                    });

                    var isCseSame = false;
                    var isModSame = false;
                    for(var i=0; i<$scope.courses.length;i++){
                        if($scope.courses[i] == cs.course){
                            isCseSame = true;
                        }
                    }
                    if(isCseSame == false){
                        $scope.courses.push(cs.course);
                    }
                    for(var i=0; i<$scope.modules.length;i++){
                        if($scope.modules[i] == cs.module){
                            isModSame = true;
                        }
                    }
                    if(isModSame == false){
                        $scope.modules.push(cs.module);
                    }
                });
            });




            //click link to respective view
            $scope.changeView = function(view){
                $location.path(view);
            };


        })();

//Other Function-------------------------------------------------------------------------------------------------------


    }]);    //End of Lecturer controller