/**
 * Created by Lee Hui Qi on 27/9/2016.
 */

'use strict';

angular.module('G1.Lecturer', ['ngMaterial','ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase', 'ui.bootstrap'])

    .controller('LecturerCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', '$firebaseObject', '$firebaseArray', 'myFactory', '$mdDialog',
        function ($route, $rootScope, $scope, $location, $http, $window, $filter, $firebaseObject, $firebaseArray, myFactory, $mdDialog) {

        (function initController() {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //haven check if the modules and courses is only taught by that lecturer (because no role yet)
            //haven check that students displayed in lecturer view are not archieve as archieve student should not appear (because no year yet)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



            const rootRef = firebase.database().ref();
        //point to the obj under courses
            const ref = rootRef.child('Courses');

            //here can use passed in variable + so that later behind that value can easier to swap
            var selectdata = myFactory.getCrseModData();
            const courseRef=rootRef.child('Courses/'+ selectdata.CrseName);
            const moduleRef=courseRef.child('modules/'+ selectdata.ModName);
            const studentRef=moduleRef.child("student");
            $scope.students = $firebaseObject(studentRef);
            $scope.ArrayStudent = $firebaseArray(studentRef);

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


        //this is to retrieve the all the students that was under the selected course and module and display it in the table next view
            $scope.studentArr = [];  //store all the students that register for the course and module
            //when the view student button was clicked...
            $scope.clickMod = function(unimod){
                var id = unimod.id;
                $scope.selectedCourse = unimod.CrseName;
                $scope.selectedModule = unimod.ModName;

                myFactory.setCrseModData(unimod);   //store the module and course that was selected into the factory so that it can be reference at any view page

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

            //to populate for the drop down list to allow lecturer to choose whether to give recommendation to the student or not
            $scope.recommendChoice =
                [
                    {id: 1, choice: "yes"},
                    {id: 2, choice: "no"}
                ];

        //when lecturer click on the submit button to submit the grades of all the student....
            $scope.submitGrade = function (result) {

                for(var i = 0; i< result.length; i++){
                    console.log("result", result[i]);
                    //check the recommend choice lecturer selects
                    var choice = result[i].recommend.choice;
                    var selectedchoice = "";
                    if(choice == "no"){    //if choice is no, means lecturer dont intend to submit recommendation for this student
                        selectedchoice = "Completed";
                    }
                    else if (choice == "yes"){
                        selectedchoice = "Entered";
                    }

                    studentRef.child(result[i].$id).update({
                        marks: result[i].marks,
                        status: selectedchoice
                    })
                }
                $window.location.href = '#/viewIndivModule';

            };

        //it will trigger when lecturer click add recommendation button
            $scope.addrecommend = function (content, key){
                content.id = key;   //add in another attribute , id, into the object
                $scope.selectedStud = content;
                myFactory.setStudRecommend($scope.selectedStud);

                $window.location.href = '#/addRecommendation';
            };

            //change the status when hod reject the recommendation
            $scope.changestatus = function(key){
                studentRef.child(key).update({
                    status: "Completed"
                });
                $window.location.href = '#/viewIndivModule';
            };

        //retrieve the selected student data from factory
            $scope.selectedStud = myFactory.getStudRecommend();

        //trigger when lecturer submit recommendation
            $scope.submitRecommendGrade = function(id){
                //update the database
                studentRef.child(id).update({
                    recommendation: {
                        RecommendedMark: $scope.recommendMark,
                        message: $scope.recommendText
                    },
                    status: "Pending"  //update the status.
                });
                $window.location.href = '#/viewIndivModule';
            };

         //retrive all the students records that have recommendation made by the lecturer
            $scope.viewAllRecommendation = function(){
                $scope.allrecommendation = [];
                ref.on('value', function(crse){
                    var indivcourseobj = crse.val();
                    crse.forEach(function(title){
                        var indivcrsename = title.key;
                        title.forEach(function(titleChild){
                            var titlename = titleChild.key;
                            if("modules" == titlename){
                                var modobj = titleChild.val();
                                titleChild.forEach(function(mod){
                                    var modname = mod.key;
                                    mod.forEach(function(modChild){
                                        var modChildTitle = modChild.key;
                                        if("student" == modChildTitle){
                                            modChild.forEach(function(stud){
                                                var studid = stud.key;
                                                var studobj = stud.val();
                                                if(studobj.recommendation != null){
                                                    //student with recommendation made
                                                    $scope.allrecommendation.push({
                                                        course: indivcrsename,
                                                        module: modname,
                                                        student_id: studid,
                                                        student_name: studobj.name,
                                                        student_recommended_mark: studobj.recommendation.RecommendedMark,
                                                        student_recommended_text: studobj.recommendation.message

                                                    })
                                                }
                                            })
                                        }
                                    })
                                })
                            }
                        })

                    })
                });
                console.log($scope.allrecommendation);
                myFactory.setViewRecommendation($scope.allrecommendation);
                $window.location.href = '#/recommendation';
            };

            //retrieve the recommendation from factory
            $scope.allrecommendation = myFactory.getViewRecommendation();

        //click link to respective view
            $scope.changeView = function(view){
                $location.path(view);
            };

            //edit prompt
            $scope.editPrompt = function(ev, currentMark, studentid) {
                // Appending dialog to document.body to cover sidenav in docs app
                console.log(currentMark);



                var confirm = $mdDialog.prompt()
                    .title('Modify Mark')
                    .textContent('Current Mark: '+ currentMark)
                    .placeholder('New Mark')
                    .ariaLabel('Enter New mark')
                    .targetEvent(ev)
                    .ok('Save')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function(result) {
                    //check if result is valid number
                    if(angular.isNumber(parseInt(result))){
                        //update

                        //use update instead of set to update that row only all the other options like save or set will replace other row in the same set/key
                        studentRef.child(studentid).update({marks:parseInt(result), status:"Completed"});
                        //tempstudent.marks=result;
                        //tempstudent.$save();
                    }



                }, function() {
                    //else do nothing
                });
            };

        })();

//Other Function-------------------------------------------------------------------------------------------------------


    }]);    //End of Lecturer controller

