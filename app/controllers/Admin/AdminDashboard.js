/**
 * Created by DHINA on 10/2/2016.
 */
/**
 * Created by DHINA on 9/28/2016.
 */
'use strict';

angular.module('G1.AdminDashboard', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase'])

    .controller('AdminDashboardCtrl', ['$rootScope', '$localStorage', '$scope', '$firebaseObject', '$firebaseArray','$crypto',
        function ($rootScope, $localStorage, $scope, $firebaseObject, $firebaseArray, $crypto) {

        (function initController() {
            $scope.archArr = [];
            $scope.Users = [];
            $scope.archiveNumber = 0;
            getCode();

            //$cookieStore.put("user", "dhina");
            //var value = $cookieStore.get("user");
            //var user=$rootScope.userData;
            $scope.userSendRequest = [];
            $scope.sendRequest = function(){
                const rootUserRef = firebase.database().ref();
                const users = rootUserRef.child('Users');

                users.once('value', function (user) {
                    user.forEach(function (child) {
                        var retrievelastChange = child.val().passwordChangedDate;  //retrieve the last change password date
                        //convert date from ddmm to mmdd
                        var dateArray = retrievelastChange.split("/");
                        var finaldate = dateArray[1]+"/"+dateArray[0]+"/"+dateArray[2];
                        console.log("retrieve ", finaldate);
                        var resetTimeFrame = 100;  //100 days timeframe
                        var startChange = 80; //80 days
                        var datelastChange = new Date(finaldate);
                        var addedTimeFrame = datelastChange.getTime() + resetTimeFrame*86400000 ;  //check when is 100 days timeframe from the date of last change password
                        var newDate = new Date(addedTimeFrame);
                        console.log("100 ", newDate);
                        var enforceChange = datelastChange.getTime() + startChange*86400000 ;
                        var expireDate = new Date(enforceChange);
                        console.log("80 ", expireDate);
                        var todayDate = new Date();
                        todayDate.setHours(0,0,0,0);   //because get current date will have timing set to the current time so reset it to zeros.

                        if(child.val().accountStatus != "Deactivated") {
                            if (todayDate.getTime() <= newDate.getTime() && todayDate.getTime() >= expireDate.getTime()) {  //when last password change date was still not reach 100days but more than or equal to 80 days
                                console.log("haven locked email ", child.val().email);
                                var same = "false";
                                for (var i = 0; i< $scope.userSendRequest.length; i++){
                                    if($scope.userSendRequest[i] == child.val().email){
                                        same = "true";
                                    }
                                }
                                if(same == "false"){
                                    $scope.userSendRequest.push(child.val().email);
                                }
                                // $scope.userSendRequest.push(child.val().email);
                                //get those student name then display it into table

                            }
                            else if (todayDate.getTime() > newDate.getTime()) {  //when last password change date has over the 100 days timeframe
                                if (child.val().role == "admin") {  //only admin role acct will need to continue send email cause cannot be locked
                                    console.log("admin expire email ", child.val().email);
                                    var adminsame = "false";
                                    for (var j = 0; j< $scope.userSendRequest.length; j++){
                                        if($scope.userSendRequest[j] == child.val().email){
                                            adminsame = "true";
                                        }
                                    }
                                    if(adminsame == "false"){
                                        $scope.userSendRequest.push(child.val().email);
                                    }
                                    // $scope.userSendRequest.push(child.val().email);
                                    //continue to send email because they have change their password
                                }
                                else {
                                    //if not admin
                                    console.log("locked email ", child.val().email);
                                    users.child(child.key).update({
                                        accountStatus: "Deactivated"  //update the status to locked when it over the given time of 100days
                                    });
                                }
                            }
                        }

                    });
                    var emails="";
                    console.log($scope.userSendRequest);
                    angular.forEach($scope.userSendRequest,function(value,index){

                        emails= emails+value+";";
                    })
                    alert(emails);

                    //construct to predefined the field
                    var link = "mailto: " + (emails) +
                        "?subject=" + ("To Reset Password") +
                        "&body=" + ("Hello Please Reset Your password Thank You");
                    window.location.href= link;
                });
            };

        })();

        //Archive student function
        $scope.archiveStudent = function() {
            console.log("Starting student archive")
            const rootRef = firebase.database().ref();
            const ref = rootRef.child('Users');
            const CouRef = rootRef.child('Courses');
            $scope.G = [];
            var count = 0;
            //todays year -3
            var year = new Date().getFullYear() - 3
            year = year.toString()
            console.log(year);
            ref.orderByChild("yearJoined").equalTo(year).once("value").then (function (snap) {
                //for each student that is required to achieve
                snap.forEach(function (childSnap) {
                    $scope.temp = childSnap.val();
                    // getGrades(childSnap.key)

                    for (var i= 0 ; i < $scope.CoursesInf.length ; i++){
                        for(var j = 0 ; j < $scope.CoursesInf[i].mod.length ; j++){
                            var Cname = $scope.CoursesInf[i].title;
                            var Mname = $scope.CoursesInf[i].mod[j].title;

                            firebase.database().ref('Courses/'+ Cname +'/modules/' + Mname + '/student').once('value', function(snshot) {
                                snshot.forEach(function (chSnap) {
                                    if(childSnap.key == chSnap.key){
                                        console.log('found match')
                                        $scope.G.push({
                                            Course: Cname,
                                            Grade: chSnap.val().marks,
                                            Module: Mname
                                        })
                                        //remove here
                                        firebase.database().ref('Courses/'+ Cname +'/modules/' + Mname + '/student/'+ chSnap.key).remove()
                                        console.log($scope.G)
                                    }
                                })
                                console.log($scope.temp);
                                console.log($scope.G);
                                //insert one obj into firebase
                                firebase.database().ref('archive/'+ childSnap.key).update({
                                    name: $scope.temp.name,
                                    email:$scope.temp.email,
                                    yearJoined:$scope.temp.yearJoined,
                                    profile: $scope.temp.profile,
                                    Grade: []
                                })
                                for (var c = 0; c < $scope.G.length ; c++){
                                    firebase.database().ref('archive/'+ childSnap.key + '/Grade/' + $scope.G[c].Course + '-' + $scope.G[c].Module ).update({
                                        marks: $scope.G[c].Grade
                                    })
                                }
                            });
                        }
                    }


                    //remove here
                     firebase.database().ref('Users/'+ childSnap.key).remove()
                    count ++;
                })
                $scope.archiveNumber = count;
                $scope.$apply();
            });

            // alert("Student archive complete, " + count + " student records archived." );
        };


            function getCode() {
                const rootRef = firebase.database().ref();
                const CourseRef = rootRef.child('Courses');
                var CourseCount = 0;
                $scope.CoursesInf = [];

                CourseRef.once("value").then ( function (snap) {
                    snap.forEach(function (childSnap) {
                        $scope.CoursesInf.push({
                            title: childSnap.key,
                            mod:[]
                        });
                        childSnap.forEach(function (ModSnap) {
                            if (ModSnap.key == "modules"){
                                ModSnap.forEach(function (CSnap) {
                                    console.log(CSnap.key)
                                    $scope.CoursesInf[CourseCount].mod.push({
                                        title: CSnap.key
                                    })
                                })
                            }
                        })
                        CourseCount++;
                    })
                })
            }

            // function getGrades(ID){
            //     for (var i= 0 ; i < $scope.CoursesInf.length ; i++){
            //       for(var j = 0 ; j < $scope.CoursesInf[i].mod.length ; j++){
            //           var Cname = $scope.CoursesInf[i].title;
            //           var Mname = $scope.CoursesInf[i].mod[j].title;
            //
            //           firebase.database().ref('Courses/'+ Cname +'/modules/' + Mname + '/student').once('value', function(snapshot) {
            //               snapshot.forEach(function (childSnap) {
            //                   if(ID == childSnap.key){
            //                       console.log('found match')
            //                       $scope.G.push({
            //                               Course: Cname,
            //                               Grade: childSnap.val().marks,
            //                               Module: Mname
            //                           })
            //                       //remove here
            //                       firebase.database().ref('Courses/'+ Cname +'/modules/' + Mname + '/student/'+ childSnap.key).remove()
            //                       console.log($scope.G)
            //                   }
            //               })
            //           });
            //       }
            //     }
            // }

        //Archive student function - end

    }]);    //End of Dashboard controller
