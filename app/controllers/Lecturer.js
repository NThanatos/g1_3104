/**
 * Created by Lee Hui Qi on 27/9/2016.
 */

'use strict';

angular.module('G1.Lecturer', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase'])

    .controller('LecturerCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', '$firebaseObject', '$firebaseArray', 'myFactory',
        function ($route,$rootScope, $scope,$location,$http,$window,$filter,$firebaseObject,$firebaseArray,myFactory) {

        (function initController() {

            const rootRef = firebase.database().ref();
        //point to the obj under courses
            const ref = rootRef.child('Courses');

        //this is to get the different course and differnt modules
            $scope.modArr = [];   //store all the modules  - for dropdown filtering usage
            $scope.cseArr = [];   //store all the courses  - for dropdown filtering usage
            $scope.dataArr = [];  //store all the courses and modules  - to loop and display it into the table

            ref.on('value', function(crse){
                var indexid = 0;
                crse.forEach(function(keymod){

                    $scope.cseArr.push(keymod.key);

                    keymod.forEach(function(modu){
                        if("modules" == (modu.key)) {
                            modu.forEach(function (mod) {

                                $scope.modArr.push(mod.key);

                                indexid= indexid+1;
                                $scope.dataArr.push({
                                    id: indexid,
                                    CrseName: keymod.key,
                                    ModName: mod.key
                                })
                            });
                        }
                    });
                });
            });



            $scope.Coursesarr = $firebaseArray(ref);  //array of json objects from courses

        //this is to retrieve the all the students that was under the selected course and module and display it in the table next view
            $scope.studentArr = [];  //store all the students that register for the course and module
            //when the view student button was clicked...
            $scope.clickMod = function(unimod){
                var id = unimod.id;
                $scope.selectedCourse = unimod.CrseName;
                $scope.selectedModule = unimod.ModName;

                myFactory.setCrseModData(unimod);   //store the module and course that was selected into the factory so that it can be reference at any view page

                for(var j=0; j<$scope.Coursesarr.length;j++){
                    if($scope.Coursesarr[j].$id == $scope.selectedCourse){  //check if the course and the selected course is the same
                        for(var sm in $scope.Coursesarr[j].modules){
                            if(sm == $scope.selectedModule){   //check if the module and the selected module is the same
                                $scope.studentobj = $scope.Coursesarr[j].modules[sm].student;
                                for(var s in $scope.studentobj){
                                    var obj = $scope.studentobj[s];
                                    obj.id = s;  //add in another id attribute into the student object
                                    $scope.studentArr.push(obj);
                                }
                            }
                        }
                    }
                }
                myFactory.setData($scope.studentArr);  //store the students that was register for that course and module into the factory
                $window.location.href = '#/viewIndivModule';   //redirect to the individual page
            };

        //assign grade based on the mark
            $scope.getGrade = function (mark) {
                if (mark > 85){
                    return 'A';
                }
                else if(mark > 70){
                    return 'B';
                }
                else if(mark > 60){
                    return 'C';
                }
                else if(mark > 50){
                    return 'D';
                }
                else if(null == mark){  //null means that no grade was being enter yet - new student
                    return '';
                }
                else{
                    return 'Fail';
                }
            };

        //retrieve the student which was used when user click to view students
            $scope.StudentArr = myFactory.getData();

        //when lecturer click on the submit button to submit the grades of all the student....
            $scope.submitGrade = function (marks) {
                $scope.SelectedCrseMod = myFactory.getCrseModData();  //get the course and modules that previously user selected from the factory

                $scope.selectCrse = $scope.SelectedCrseMod.CrseName;
                $scope.selectMod = $scope.SelectedCrseMod.ModName;

                const rootRef = firebase.database().ref();
                const ref = rootRef.child('Courses');
                const crselist = ref.child($scope.selectCrse);
                const modlist = crselist.child('modules/' + $scope.selectMod);
                const studlist = modlist.child('student');

                console.log("studentmarks", $scope.StudentArr); //the marks is updated with the marks that was entered as input

                for(var i = 0; i< $scope.StudentArr.length; i++){
                    modlist.on("value", function(modchild){
                        for(var s in modchild.val().student){
                            if(s == $scope.StudentArr[i].id){
                                const studobj = studlist.child(s);
                                studobj.update({
                                    marks: $scope.StudentArr[i].marks,   //this is to add the new attribute key and value into the existing object in the database
                                    status: "Entered"   //this is to update the existing value
                                });

                            }
                        }
                    });
                }
            };


        //click link to respective view
            $scope.changeView = function(view){
                $location.path(view);
            };




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //testing data
            // $scope.dataTesting =
            //     [
            //         {
            //             "id": "asdaf",
            //             "course":
            //                 [
            //                     {
            //                         "crseName": "ICT",
            //                         "hod": "prof1",
            //                         "modules":
            //                             [
            //                                 {
            //                                     "modName": "ICT1001",
            //                                     "lecturer":
            //                                         [
            //                                             {"lectName": "lect1"},
            //                                             {"lectName": "lect2"}
            //                                         ],
            //                                     "students":
            //                                         [
            //                                             {
            //                                                 "studMatrix": "STU1243",
            //                                                 "studName": "stud1",
            //                                                 "studMarks": 45,
            //                                                 "studRecommendation":
            //                                                     [
            //                                                         {"recommendMark": 70, "message": "increase", "value": 1}
            //                                                     ],
            //                                                 "marksStatus": "entered"
            //                                             },
            //                                             {
            //                                                 "studMatrix": "STU3251",
            //                                                 "studName": "stud2",
            //                                                 "studMarks": null,
            //                                                 "studRecommendation":
            //                                                     [
            //                                                         {"recommendMark": null, "message": null, "value": null}
            //                                                     ],
            //                                                 "marksStatus": "new"
            //                                             }
            //                                         ]
            //                                 },
            //
            //                                 {
            //                                     "modName": "ICT2102",
            //                                     "lecturer":
            //                                         [
            //                                             {"lectName": "lect3"},
            //                                             {"lectName": "lect4"}
            //                                         ],
            //                                     "students":
            //                                         [
            //                                             {
            //                                                 "studMatrix": "STU3546",
            //                                                 "studName": "stud3",
            //                                                 "studMarks": 45,
            //                                                 "studRecommendation":
            //                                                     [
            //                                                         {"recommendMark": 70, "message": "increase", "value": 1}
            //                                                     ],
            //                                                 "marksStatus": "entered"
            //                                             },
            //                                             {
            //                                                 "studMatrix": "STU12435",
            //                                                 "studName": "stud4",
            //                                                 "studMarks": null,
            //                                                 "studRecommendation":
            //                                                     [
            //                                                         {"recommendMark": null, "message": null, "value": null}
            //                                                     ],
            //                                                 "marksStatus": "new"
            //                                             }
            //                                         ]
            //                                 }
            //                             ]
            //                     },
            //
            //                     {
            //                         "crseName": "ACC",
            //                         "hod": "prof2",
            //                         "modules":
            //                             [
            //                                 {
            //                                     "modName": "ACC2102",
            //                                     "lecturer":
            //                                         [
            //                                             {"lectName": "lect5"},
            //                                             {"lectName": "lect6"}
            //                                         ],
            //                                     "students":
            //                                         [
            //                                             {
            //                                                 "studMatrix": "STU3821",
            //                                                 "studName": "stud5",
            //                                                 "studMarks": 45,
            //                                                 "studRecommendation":
            //                                                     [
            //                                                         {"recommendMark": 70, "message": "increase", "value": 1}
            //                                                     ],
            //                                                 "marksStatus": "entered"
            //                                             },
            //                                             {
            //                                                 "studMatrix": "STU2350",
            //                                                 "studName": "stud6",
            //                                                 "studMarks": null,
            //                                                 "studRecommendation":
            //                                                     [
            //                                                         {"recommendMark": null, "message": null, "value": null}
            //                                                     ],
            //                                                 "marksStatus": "new"
            //                                             }
            //                                         ]
            //                                 },
            //
            //                                 {
            //                                     "modName": "ACC4201",
            //                                     "lecturer":
            //                                         [
            //                                             {"lectName": "lect7"},
            //                                             {"lectName": "lect8"}
            //                                         ],
            //                                     "students":
            //                                         [
            //                                             {
            //                                                 "studMatrix": "STU9053",
            //                                                 "studName": "stud7",
            //                                                 "studMarks": 45,
            //                                                 "studRecommendation":
            //                                                     [
            //                                                         {"recommendMark": 70, "message": "increase", "value": 1}
            //                                                     ],
            //                                                 "marksStatus": "entered"
            //                                             },
            //                                             {
            //                                                 "studMatrix": "STU0002",
            //                                                 "studName": "stud8",
            //                                                 "studMarks": null,
            //                                                 "studRecommendation":
            //                                                     [
            //                                                         {"recommendMark": null, "message": null, "value": null}
            //                                                     ],
            //                                                 "marksStatus": "new"
            //                                             }
            //                                         ]
            //                                 }
            //                             ]
            //                     }
            //                 ]
            //
            //         }
            //     ];
            //
            // //transform the data
            // $scope.datatestingTransformed = [];
            // $scope.courseName = [];
            // $scope.moduleName = [];
            // $scope.dataTesting.forEach(function(rootref){
            //     rootref.course.forEach(function(courseref) {
            //         courseref.modules.forEach(function(modref){
            //             modref.students.forEach(function(sturef){
            //                 //get the different courses
            //                 var courseSame = false;
            //                 for (var i = 0; i < $scope.courseName.length; i++) {
            //                     if ($scope.courseName[i] == courseref.crseName) {
            //                         courseSame = true;
            //                     }
            //                 }
            //                 if (courseSame == false) {
            //                     $scope.courseName.push(courseref.crseName);
            //                 }
            //                 //get the different modules
            //                 var moduleSame = false;
            //                 for (var m = 0; m < $scope.moduleName.length; m++) {
            //                     if ($scope.moduleName[m] == modref.modName) {
            //                         moduleSame = true;
            //                     }
            //                 }
            //                 if (moduleSame == false) {
            //                     $scope.moduleName.push(modref.modName);
            //                 }
            //
            //                 //array with course, modules, student
            //                 $scope.datatestingTransformed.push({
            //                     id: rootref.id,
            //                     coursename: courseref.crseName,
            //                     modulename: modref.modName,
            //                     stumatrix: sturef.studMatrix,
            //                     stumarks: sturef.studMarks,
            //                     publishstatus: sturef.marksStatus
            //                 });
            //             });
            //         });
            //     });
            // });

        })();

//Other Function-------------------------------------------------------------------------------------------------------


    }]);    //End of Lecturer controller