'use strict';

angular.module('G1.Hod', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase'])

    .controller('HodCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', '$firebaseObject', '$firebaseArray','$localStorage',
        function ($route,$rootScope, $scope,$location,$http,$window,$filter,$firebaseObject,$firebaseArray,$localStorage) {

        (function initController() {
            getCourses();

            $scope.currentTab = '';
            $scope.showGradeTable = true;
            $scope.NoRecommendation = true;
            $scope.editGradeForm = true;
            $scope.moderateForm = true;
            $scope.editGradeFormContent=[];
            $scope.ModerateMarksBy = 0;

        })();


//Other Function------------------------------------------------------------------------------------------------------
        function getCourses() {
            // //get the entire database tree
            // var take=false;
            // console.log($localStorage.userid, " asd");
            // $scope.Coursesarray = [];
            const rootRef = firebase.database().ref();

            //zoom in to users table
            console.log($localStorage.credential.AssignedTo)
            const ref = rootRef.child('Courses/'+$localStorage.credential.AssignedTo+'/modules');
            //this allows us to use the array and the scope notation we are used to
            $scope.Courses = $firebaseArray(ref);
            $scope.ProgramName = $localStorage.credential.AssignedTo;
            
            console.log($scope.Courses)

        }
            
        $scope.checkRecommemdationExist = function () {
            var check = false;
            const rootRef = firebase.database().ref();
            const Checkref = rootRef.child('Courses/' + $localStorage.credential.AssignedTo + '/modules/' + $scope.currentCourseId + '/student');
            Checkref.orderByChild("status").equalTo("Pending").once("value").then (function (snap) {
                snap.forEach(function (childSnap) {
                  console.log(childSnap.val())
                      check = true;
                })
                if (check){
                    alert("Some student still have pending recommendation.");
                }
                else{
                    PublishGrades();
                }
            })


        }
            function PublishGrades () {
            var PublishStatus = {status: 'Published'}
            firebase.database().ref('Courses/'+$localStorage.credential.AssignedTo+'/modules/'+ $scope.currentCourseId).update(PublishStatus);
            $scope.currentCourseStatus = 'Published';
            $scope.SelectedStatus = true;
        }

        $scope.toggleeditGradeForm = function(item) {
            console.log(item)
            $scope.editGradeForm = $scope.editGradeForm === false ? true: false;
            $scope.editGradeFormContent = item;
            $scope.selectStudentId = item.id;
            // console.log(item.$id)
        };

            $scope.SetmoderateMarks = function(input){
                $scope.ModerateMarksBy = input;
                console.log('Moderate mark change to :' + input)
            };

            $scope.moderateMarks = function (mark) {
                var newMark = parseInt(mark)
                console.log(mark);
                for (var i= 0; i < $scope.Grades.length ;i++){
                    $scope.Grades[i].marks = $scope.Grades[i].marks + newMark;
                    firebase.database().ref('Courses/'+$localStorage.credential.AssignedTo+'/modules/'+ $scope.currentCourseId + '/student/'+$scope.Grades[i].$id).update({marks: $scope.Grades[i].marks });
                }
            };
            
        //Click on tab to change content
        $scope.onClickTab = function (tab) {
            $scope.currentTab = 'views/courseGrades.html';
            $scope.currentCourse = tab.title;
            $scope.currentCourseStatus = tab.status;
            $scope.showGradeTable = false;
            $scope.newTab = tab;
            $scope.currentCourseId = tab.$id;
            // console.log($scope.currentCourseId)
            if ($scope.currentCourseStatus == 'Pending'){
                $scope.SelectedStatus = false;
            }
            else {
                $scope.SelectedStatus = true;
            }
            // set grades info
            // $scope.Grades = $scope.Courses[$scope.Courses.indexOf(tab)].student
            renderGrades()
        };
            function renderGrades() {
                const srootRef = firebase.database().ref();
                const getStuRef = srootRef.child('Courses/'+$localStorage.credential.AssignedTo+'/modules/'+$scope.currentCourseId+'/student');
                $scope.Grades =[];
                // const Sref = srootRef.child('Courses/'+$localStorage.credential.AssignedTo+'/modules/'+$scope.currentCourseId+'/student');
                // //this allows us to use the array and the scope notation we are used to
                // $scope.Grades = $firebaseArray(Sref);
                console.log($scope.Grades)
                getStuRef.once("value").then (function (snap) {
                    snap.forEach(function (childSnap) {
                        console.log(childSnap.key)
                        console.log(childSnap.val().recommendation.RecommendedMark)
                        $scope.Grades.push({
                            id: childSnap.key,
                            marks: childSnap.val().marks,
                            name: childSnap.val().name,
                            status: childSnap.val().status,
                            recommendation: {
                                RecommendedMark: childSnap.val().recommendation.RecommendedMark,
                                message: childSnap.val().recommendation.message,
                                value: childSnap.val().recommendation.value
                            }
                        })
                        $scope.$apply();
                    })
                });
            }

        $scope.isActiveTab = function(tabContent) {
            return tabContent == $scope.currentCourse;
        };

        $scope.checkRecommemdation = function (item) {
            if (item == 'Pending'){
                return false;
            }
            else {
                return true;
            }
        };
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
            else{
                return 'Fail';
            }
        };
            
        $scope.replyRecommendation = function (answer) {

            var newStatus = {status: answer}

            console.log($scope.selectStudentId);
            console.log(newStatus);
            // need to change student id
           // firebase.database().ref('Courses/ICT/modules/'+ $scope.currentCourseId + '/student/'+ $scope.selectStudentId +'/recommendation').update(updateValue);
            firebase.database().ref('Courses/'+$localStorage.credential.AssignedTo+'/modules/'+ $scope.currentCourseId + '/student/'+ $scope.selectStudentId ).update(newStatus);

            // refesh grades info
            // $scope.Grades = $scope.Courses[$scope.Courses.indexOf($scope.newTab)].student
            renderGrades();
            $scope.editGradeForm = $scope.editGradeForm === false ? true: false;
        }

    }]);    //End of Dashboard controller
