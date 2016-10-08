'use strict';

angular.module('G1.Hod', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase'])

    .controller('HodCtrl',  ['$route','$rootScope', '$scope','$location','$http', '$window', '$filter', '$firebaseObject', '$firebaseArray','$cookies','$cookieStore',
        function ($route,$rootScope, $scope,$location,$http,$window,$filter,$firebaseObject,$firebaseArray,$cookies,$cookieStore) {

        (function initController() {

            //Display spinner during data loading
            // $scope.LoadingFalse();
            // $scope.LoadingTrue;

            getCourses();
            //
            // var Courses = firebase.database().ref().child("Courses");
            // Courses.on('value', function (datasnapshot) {
            //     $scope.Courses = datasnapshot.val();
            //     console.log($scope.Courses[1].title);
            //     // $scope.Courses.push({
            //     //     title: datasnapshot.child("title").val(),
            //     //     status: datasnapshot.child("status").val()
            //     // })
            // });


            $scope.currentTab = '';
            $scope.showGradeTable = true;
            $scope.NoRecommendation = true;
            $scope.editGradeForm = true;
            $scope.editGradeFormContent=[];


        })();


//Other Function------------------------------------------------------------------------------------------------------
        function getCourses() {
            //get the entire database tree
            const rootRef = firebase.database().ref();

            //zoom in to users table
            const ref = rootRef.child('Courses/ICT/modules');
            //this allows us to use the array and the scope notation we are used to
            $scope.Courses = $firebaseArray(ref);
        }

        $scope.PublishGrades = function () {
            alert("Logic not done!")
        }

        $scope.toggleeditGradeForm = function(item) {
            $scope.editGradeForm = $scope.editGradeForm === false ? true: false;
            console.log(item)
            $scope.editGradeFormContent = item;
        };

        //Click on tab to change content
        $scope.onClickTab = function (tab) {
            $scope.currentTab = 'views/courseGrades.html';
            $scope.currentCourse = tab.title;
            $scope.currentCourseStatus = tab.status;
            $scope.showGradeTable = false;
            $scope.newTab = tab;

            if ($scope.currentCourseStatus == 'Pending'){
                $scope.SelectedStatus = false;
            }
            else {
                $scope.SelectedStatus = true;
            }

            // set grades info
            $scope.Grades = $scope.Courses[$scope.Courses.indexOf(tab)].student
            console.log('index is : '+ $scope.Courses.indexOf(tab));
            console.log($scope.Grades);
            console.log($scope.Courses);
            // console.log($scope.Grades[0].marks);
        };
        $scope.isActiveTab = function(tabContent) {
            return tabContent == $scope.currentCourse;
        };

        $scope.checkRecommemdation = function (item) {
            if (item == 0){
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
            
        $scope.replyRecommendation = function (value, answer) {

            var updateValue = {value: value}
            var newStatus = {status: answer}

            // need to change student id
            firebase.database().ref('Courses/ICT/modules/ICT1101/student/KTEeY14xEr-od4jg1ND/recommendation').update(updateValue)
            firebase.database().ref('Courses/ICT/modules/ICT1101/student/KTEeY14xEr-od4jg1ND').update(newStatus);

            // getCourses()
            // set grades info
            $scope.Grades = $scope.Courses[$scope.Courses.indexOf($scope.newTab)].student
            console.log('index is : '+ $scope.Courses.indexOf($scope.newTab));
            console.log($scope.Grades);
            console.log($scope.Courses);

            $scope.editGradeForm = $scope.editGradeForm === false ? true: false;
        }

    }]);    //End of Dashboard controller
