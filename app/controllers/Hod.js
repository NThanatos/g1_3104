'use strict';

angular.module('G1.Hod', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase'])

    .controller('HodCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', '$firebaseObject', '$firebaseArray','$cookies','$cookieStore',
        function ($route,$rootScope, $scope,$location,$http,$window,$filter,$firebaseObject,$firebaseArray,$cookies,$cookieStore) {

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
            //get the entire database tree
            const rootRef = firebase.database().ref();

            //zoom in to users table
            const ref = rootRef.child('Courses/ICT/modules');
            //this allows us to use the array and the scope notation we are used to
            $scope.Courses = $firebaseArray(ref);
            console.log($firebaseArray(ref))
        }

        
        $scope.PublishGrades = function () {
            var PublishStatus = {status: 'Published'}
            firebase.database().ref('Courses/ICT/modules/'+ $scope.currentCourseId).update(PublishStatus);
            $scope.currentCourseStatus = 'Published';
            $scope.SelectedStatus = true;
        }

        $scope.toggleeditGradeForm = function(item) {
            $scope.editGradeForm = $scope.editGradeForm === false ? true: false;
            $scope.editGradeFormContent = item;
            $scope.selectStudentId = item.$id;
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
                    console.log($scope.Grades[i].marks);
                    console.log($scope.Grades[i].$id);
                    $scope.Grades[i].marks = $scope.Grades[i].marks + newMark;
                    console.log($scope.Grades[i].marks);
                    firebase.database().ref('Courses/ICT/modules/'+ $scope.currentCourseId + '/student/'+$scope.Grades[i].$id).update({marks: $scope.Grades[i].marks });
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
            const srootRef = firebase.database().ref();
            const Sref = srootRef.child('Courses/ICT/modules/'+$scope.currentCourseId+'/student');
            //this allows us to use the array and the scope notation we are used to
            $scope.Grades = $firebaseArray(Sref);
            console.log($scope.Grades);
        };

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

            // need to change student id
           // firebase.database().ref('Courses/ICT/modules/'+ $scope.currentCourseId + '/student/'+ $scope.selectStudentId +'/recommendation').update(updateValue);
            firebase.database().ref('Courses/ICT/modules/'+ $scope.currentCourseId + '/student/'+ $scope.selectStudentId ).update(newStatus);

            // refesh grades info
            $scope.Grades = $scope.Courses[$scope.Courses.indexOf($scope.newTab)].student
            $scope.editGradeForm = $scope.editGradeForm === false ? true: false;
        }

    }]);    //End of Dashboard controller
