'use strict';

angular.module('G1.ModManagement', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('ModManagementCtrl', ['$route', '$rootScope', '$scope', '$location', '$localStorage', '$http', '$window', '$filter', '$crypto','$firebaseObject', '$firebaseArray',
        function ($route, $rootScope, $scope, $location, $localStorage, $http, $window, $filter, $firebaseObject, $firebaseArray , $crypto) {

        (function initController() {
            getCourseCode()
        })();
//Other Function-------------------------------------------------------------------------------------------------------
            $scope.currentTab = '';

            function getCourseCode() {
                const rootRef = firebase.database().ref();
                const CourseRef = rootRef.child('Courses');
                var CourseCount = 0;
                $scope.CoursesInfo = [];

                CourseRef.on("value", function (snap) {
                    snap.forEach(function (childSnap) {
                        $scope.CoursesInfo.push({
                            title: childSnap.key,
                            mod:[],
                            hod:[]
                        });
                        childSnap.forEach(function (ModSnap) {
                            if(ModSnap.key == "hod"){
                                $scope.CoursesInfo[CourseCount].hod.push({
                                    name: ModSnap.val()
                                })
                            }
                            else if (ModSnap.key == "modules"){
                                ModSnap.forEach(function (CSnap) {
                                    console.log(CSnap.key)
                                    $scope.CoursesInfo[CourseCount].mod.push({
                                        title: CSnap.key
                                    })
                                })
                            }
                        })
                        CourseCount++;
                    })
                    console.log($scope.CoursesInfo)
                })
            }

            function getStudent(modkey, Ckey) {
                $scope.Students = [];
                firebase.database().ref('Courses/'+ Ckey +'/modules/' + modkey + '/student').on('value', function(snapshot) {
                    console.log(snapshot.val());
                    snapshot.forEach(function (childSnap) {
                        console.log(childSnap.key);
                        $scope.Students.push({
                            name: childSnap.val().name,
                            Ckey : Ckey,
                            modkey: modkey,
                            IDkey: childSnap.key
                        }
                        );
                    })
                });
            }
            function getLecturer(modkey, Ckey) {
                $scope.Lecturer = [];
                firebase.database().ref('Courses/'+ Ckey +'/modules/' + modkey + '/lecturers').on('value', function(snapshot) {
                    console.log(snapshot.val());
                    snapshot.forEach(function (childSnap) {
                        console.log(childSnap.val().name);
                        $scope.Lecturer.push({
                                name: childSnap.val().name,
                                Ckey : Ckey,
                                modkey: modkey,
                                IDkey: childSnap.key
                        }
                        );
                    })
                });
            }

            $scope.GetCurrentTab = function (IDkey, Ckey) {
                getLecturer(IDkey, Ckey)
                getStudent(IDkey, Ckey)
                $scope.CurrentTitle= IDkey
                $scope.CurrentProg = Ckey
                $scope.currentTab = 'views/Admin/ModTemplate.html'
            }


           $scope.RemoveUser = function (Ckey, modkey, IDkey, type) {
               firebase.database().ref('Courses/'+ Ckey +'/modules/' + modkey + '/' + type+ '/' + IDkey).remove()
               getCourseCode()
               getLecturer(modkey, Ckey)
               getStudent(modkey, Ckey)
               $scope.CurrentTitle= modkey
               $scope.CurrentProg = Ckey
               $scope.currentTab = 'views/Admin/ModTemplate.html'
           }
            
            $scope.AddUser = function () {
                getAllStudents()
                getAllLecturers()
            }

            $scope.AddStudenttoClass = function (IDkey, course, mod, name) {
                console.log('Courses/' + course + '/modules/' + mod + '/student/' + IDkey)
                firebase.database().ref('Courses/' + course + '/modules/' + mod + '/student/' + IDkey).set({
                    name: name,
                    marks: 0
                });
                getCourseCode()
                getLecturer(mod, course)
                getStudent(mod, course)
                $scope.CurrentTitle= mod
                $scope.CurrentProg = course
                $scope.currentTab = 'views/Admin/ModTemplate.html'
            }
            $scope.AddLecturertoClass = function (IDkey, course, mod, name) {
                console.log('Courses/' + course + '/modules/' + mod + '/lecturers/' + IDkey)
                firebase.database().ref('Courses/' + course + '/modules/' + mod + '/lecturers/' + IDkey).set({
                    name: name,
                    marks: 0
                });
                getCourseCode()
                getLecturer(mod, course)
                getStudent(mod, course)
                $scope.CurrentTitle= mod
                $scope.CurrentProg = course
                $scope.currentTab = 'views/Admin/ModTemplate.html'
            }

            function getAllStudents() {
                $scope.StudentstoAdd = [];
                var checkDup = false;
                console.log('Starting get student')
                const rootRef = firebase.database().ref();
                const ref = rootRef.child('Users');
                ref.orderByChild("role").equalTo('student').on("value", function (snap) {
                    snap.forEach(function (childSnap) {
                        for(var i =0; i < $scope.Students.length; i++){
                            if(childSnap.val().name == $scope.Students[i].name){
                                checkDup = true;
                                console.log($scope.Students[i].name + 'duplicate found')
                            }
                        }
                        if(!checkDup){
                            $scope.StudentstoAdd.push({
                                name: childSnap.val().name,
                                IDkey: childSnap.key
                            })
                        }
                        checkDup = false;
                    })
                });
            }

            function getAllLecturers() {
                $scope.LecturerstoAdd = [];
                var checkDup = false;
                console.log('Starting get Lectuerer')
                const rootRef = firebase.database().ref();
                const ref = rootRef.child('Users');
                ref.orderByChild("role").equalTo('lecturer').on("value", function (snap) {
                    snap.forEach(function (childSnap) {
                        for(var i =0; i < $scope.Lecturer.length; i++){
                            if(childSnap.val().name == $scope.Lecturer[i].name){
                                checkDup = true;
                                console.log($scope.Lecturer[i].name + 'duplicate found')
                            }
                        }
                        if(!checkDup){
                            $scope.LecturerstoAdd.push({
                                name: childSnap.val().name,
                                IDkey: childSnap.key
                            })
                        }
                        checkDup = false;
                    })
                });
            }
    }]);    //End of Dashboard controller