/**
 * Created by Lee Hui Qi on 27/9/2016.
 */

'use strict';

angular.module('G1.Lecturer', ['ngMaterial', 'ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase', 'ui.bootstrap'])

    .controller('LecturerCtrl', ['$route', '$rootScope', '$scope', '$location', '$http', '$window', '$filter', '$firebaseObject', '$firebaseArray', 'myFactory', '$mdDialog', '$crypto', '$localStorage',
        function ($route, $rootScope, $scope, $location, $http, $window, $filter, $firebaseObject, $firebaseArray, myFactory, $mdDialog, $crypto, $localStorage) {

            (function initController() {

                getStudentGrades();


                const rootRef = firebase.database().ref();
                //point to the obj under courses
                const ref = rootRef.child('Courses');

                //here can use passed in variable + so that later behind that value can easier to swap
                var selectdata = myFactory.getCrseModData();
                const courseRef = rootRef.child('Courses/' + selectdata.CrseName);
                const moduleRef = courseRef.child('modules/' + selectdata.ModName);
                const studentRef = moduleRef.child("student");
                $scope.students = $firebaseObject(studentRef);
                $scope.ArrayStudent = $firebaseArray(studentRef);

                //this is to get the different course and differnt modules
                $scope.modArr = [];   //store all the modules  - for dropdown filtering usage
                $scope.cseArr = [];   //store all the courses  - for dropdown filtering usage
                $scope.dataArr = [];  //store all the courses and modules  - to loop and display it into the table


                ref.on('value', function (crse) {
                    var indexid = 0;
                    crse.forEach(function (keymod) {
                        keymod.forEach(function (modu) {
                            if ("modules" == (modu.key)) {
                                modu.forEach(function (mod) {
                                    mod.forEach(function(modchild){
                                        if("lecturers" == (modchild.key)){
                                            modchild.forEach(function(lect){
                                                if($localStorage.userid === lect.key){
                                                    $scope.cseArr.push(keymod.key);
                                                    $scope.modArr.push(mod.key);
                                                    indexid = indexid + 1;
                                                    $scope.dataArr.push({
                                                        id: indexid,
                                                        CrseName: keymod.key,
                                                        ModName: mod.key
                                                    })

                                                }
                                            })
                                        }
                                    })


                                });
                            }
                        });
                    });
                });

                //this is to retrieve the all the students that was under the selected course and module and display it in the table next view
                $scope.studentArr = [];  //store all the students that register for the course and module
                //when the view student button was clicked...
                $scope.clickMod = function (unimod) {
                    var id = unimod.id;
                    $scope.selectedCourse = unimod.CrseName;
                    $scope.selectedModule = unimod.ModName;

                    myFactory.setCrseModData(unimod);   //store the module and course that was selected into the factory so that it can be reference at any view page

                    $window.location.href = '#/viewIndivModule';   //redirect to the individual page
                };

                //assign grade based on the mark
                $scope.getGrade = function (mark) {
                    if (mark > 85) {
                        return 'A';
                    }
                    else if (mark > 70) {
                        return 'B';
                    }
                    else if (mark > 60) {
                        return 'C';
                    }
                    else if (mark > 50) {
                        return 'D';
                    }
                    else if (null == mark) {  //null means that no grade was being enter yet - new student
                        return '';
                    }
                    else {
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

                    for (var i = 0; i < result.length; i++) {
                        console.log("result", result[i]);
                        //check the recommend choice lecturer selects
                        var choice = result[i].recommend.choice;
                        var selectedchoice = "";
                        if (choice == "no") {    //if choice is no, means lecturer dont intend to submit recommendation for this student
                            selectedchoice = "Completed";
                        }
                        else if (choice == "yes") {
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
                $scope.addrecommend = function (content, key) {
                    content.id = key;   //add in another attribute , id, into the object
                    $scope.selectedStud = content;
                    myFactory.setStudRecommend($scope.selectedStud);

                    $window.location.href = '#/addRecommendation';
                };

                //change the status when hod reject the recommendation
                $scope.changestatus = function (key) {
                    studentRef.child(key).update({
                        status: "Completed"
                    });
                    $window.location.href = '#/viewIndivModule';
                };

                //retrieve the selected student data from factory
                $scope.selectedStud = myFactory.getStudRecommend();

                //trigger when lecturer submit recommendation
                $scope.submitRecommendGrade = function (id) {
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

                //click link to respective view
                $scope.changeView = function (view) {
                    $location.path(view);
                };

                //edit prompt
                $scope.editPrompt = function (ev, currentMark, studentid, recommendedmark) {
                    // Appending dialog to document.body to cover sidenav in docs app
                    console.log(currentMark);


                    var confirm = $mdDialog.prompt()
                        .title('Modify Mark')
                        .textContent('Current Mark: ' + currentMark)
                        .placeholder('Recommended Mark: '+ recommendedmark)
                        .ariaLabel('Enter New mark')
                        .targetEvent(ev)
                        .ok('Save')
                        .cancel('Cancel');

                    $mdDialog.show(confirm).then(function (result) {
                        //check if result is valid number
                        if (angular.isNumber(parseInt(result))) {
                            //update
                            //validation within currentmark and recommendedmark
                            if(parseInt(result)<=recommendedmark&&parseInt(result)>=currentMark){
                                //use update instead of set to update that row only all the other options like save or set will replace other row in the same set/key
                                studentRef.child(studentid).update({marks: parseInt(result), status: "Completed"});

                            }else{
                                alert("invalid input, exceed range of recommendation or current marks")
                            }

                        }


                    }, function () {
                        //else do nothing
                    });
                };

                /*-----------------------------Retrieve Student Particulars-----------------------------*/
                function getStudentParticulars() {
                    $scope.studentParticularsArr = []
                    //lecturers and hod are general, they don't belong to any courses.
                    //So retrieve all the student particulars in a list, which includes their name, gender and phone number
                    //and display them with a delete button in the view to delete the student in the system.

                    const userRef2 = rootRef.child('Users');
                    userRef2.once("value",function(snapshot) {
                        snapshot.forEach(function(userSnap) {
                            userSnap.forEach(function(userDetails) {
                                userDetails.forEach(function() {
                                    $scope.Student_Email = userSnap.val().email;
                                    $scope.Student_Name = userSnap.val().name;
                                    $scope.Address = userDetails.val().address;
                                    $scope.Gender = userDetails.val().gender;
                                    $scope.userKey = userSnap.key

                                    $scope.Nok = userDetails.val().nok;
                                    $scope.Nok_Phone = userDetails.val().nokPhone;
                                    $scope.Phone = userDetails.val().phone;
                                    $scope.Citizenship = userDetails.val().citizenship;
                                    $scope.Password = userSnap.val().password;
                                    $scope.YearJoined = userSnap.val().yearJoined;
                                })
                            })
                            if(userSnap.val().role == "student") {
                                $scope.studentParticularsArr.push(
                                    {
                                        "User_Key": $scope.userKey,
                                        "Student_Email": $scope.Student_Email,
                                        "Student_Name": $scope.Student_Name,
                                        "Address": $scope.Address,
                                        "Gender": $scope.Gender,

                                        "Nok": $scope.Nok,
                                        "Nok_Phone" :$scope.Nok_Phone,
                                        "Phone": $scope.Phone,
                                        "Citizenship": $scope.Citizenship,
                                        "Password": $scope.Password,
                                        "Year_Joined": $scope.YearJoined


                                    })
                            }
                        })
                        $scope.$apply();

                    })
                }
                /*------------------------End of Retrieving Student Particulars---------------------------*/
                getStudentParticulars();


            })();

//Other Function-------------------------------------------------------------------------------------------------------
            function getStudentGrades() {
                //declare array to store students
                $rootScope.studentsgradesArrrootscope = [];//store all the students in array
                const rootRef = firebase.database().ref();
                var studentsRef = rootRef.child('Users')
                //get each student's details
                studentsRef.once('value', function (snapshot) {
                    snapshot.forEach(function (userSnapshot) {
//checking if user is student before getting his details

                        if (userSnapshot.val().role == "student" && (userSnapshot.val().accountStatus == "Activated")) {
                            $scope.email = userSnapshot.val().email;
                            $scope.name = userSnapshot.val().name;
                            //decrypting gpa before showing to user

                            if(userSnapshot.val().gpa==0)
                            {
                                $scope.gpa=userSnapshot.val().gpa;

                            }
                            else {
                                $scope.gpa = $crypto.decrypt(userSnapshot.val().gpa);
                            }

                            //pushing details of each student to array for display
                            $scope.studentsgradesArrrootscope.push({
                                "email": $scope.email,
                                "name": $scope.name,
                                "gpa": $scope.gpa
                            });

                        }
                    })
                    $scope.$apply();
                })
                //
            }


            /*---------------------------Delete Student Particulars Function-----------------------*/
            $scope.deleteStudentParticulars = function(item) {
                //get the entire database tree
                //alert("test: " + item) //item is the email passed in.
                const rootRef = firebase.database().ref();

                //zoom in to users table
                const ref = rootRef.child('Users');

                ref.child(item).remove();
                alert("Delete Student Particulars Successful !")
                $route.reload();
                getStudentParticulars();
            }
            /*-------------------------End of Delete Student Particulars Function------------------*/

            /*---------------------------Edit Student Particulars Function-----------------------*/
            $scope.editStudentParticulars = function(item) {

                $scope.currentStudent = item;
            }

            /*---------------------------End of Edit Student Particulars Function-----------------------*/


            $scope.updateStudentParticulars = function(item) {
                var currentDate = $filter('date')(new Date(), 'dd/MM/yyyy'); //for lastchangepassword field
                //$scope.EditStudentForm = false;

                //alert(item.User_Key + " USER KEY")
                //alert(item.Student_Name + " STUDENT NAME")

                const rootRef = firebase.database().ref();

                //zoom in to users table
                const ref = rootRef.child('Users');

                ref.child(item.User_Key).update({
                    name: item.Student_Name,
                    email: item.Student_Email,
                    role: "student",
                    accountStatus: "Activated",
                    yearJoined: item.Year_Joined,
                    password: item.Password,
                    passwordChangedDate: currentDate,
                    gpa: 0.00,
                    profile: {
                        address: item.Address,
                        citizenship: item.Citizenship,
                        gender: item.Gender,
                        nok: item.Nok,
                        nokPhone: item.Nok_Phone,
                        phone: item.Phone
                    }

                });
                //$('#editModal').removeClass('fade')
                //$('#editModal').modal('hide')
                $route.reload()
                $('#editModal').modal('hide')


            }

        }]);    //End of Lecturer controller

