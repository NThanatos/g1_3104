/**
 * Created by DHINA on 10/2/2016.
 */
/**
 * Created by DHINA on 9/28/2016.
 */
'use strict';

angular.module('G1.AdminDashboard', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase'])

    .controller('AdminDashboardCtrl', ['$rootScope', '$localStorage', '$scope', '$firebaseObject', '$firebaseArray',
        function ($rootScope, $localStorage, $scope, $firebaseObject, $firebaseArray) {

        (function initController() {
            $scope.archArr = [];
            $scope.Users = [];
            getUsers();

            //$cookieStore.put("user", "dhina");
            //var value = $cookieStore.get("user");
            //var user=$rootScope.userData;

        })();

        //Archive student function
        function getUsers() {
            const rootRef = firebase.database().ref();
            const ref = rootRef.child('Users');
            /*
            // $scope.Users = $firebaseArray(ref)
            ref.on('value', function(crse){
                crse.forEach(function(keymod){
                    keymod.forEach(function(title){
                        if(title.key == 'yearJoined'){
                            var tempcheck = title.val()
                            tempcheck = parseInt(tempcheck)
                            //add date year
                            if (tempcheck < 2015){
                                $scope.archArr.push(keymod.key);
                                console.log(keymod);
                            }
                            
                        }
                    })

                });
                console.log($scope.archArr.length)

                for(var count= 0; count < $scope.archArr.length ;count++){
                    console.log($scope.archArr[count])
                    var GetRef = rootRef.child('Users/'+ $scope.archArr[count])
                    $scope.Users.push($firebaseObject(GetRef))
                    //console.log($scope.Users.length)
                    //console.log($scope.Users[count])
                    //
                    // var asd = $scope.Users[0];
                    //
                    // console.log(asd);
                    // firebase.database().ref('archive/'+ $scope.archArr[count]).set($scope.Users[count])
                    // firebase.database().ref('archive/'+ $scope.archArr[count]).set({name: 'tester', value: 2})
                }
 //               firebase.database().ref('archive/'+ $scope.archArr[count]).set($scope.Users)
            });
            */
            const achref = ref.child("testach");
            //todays year -3
            var year = "2013";
            ref.orderByChild("yearJoined").equalTo(year).on("value", function (snap) {
                //for each student that is required to achieve
                snap.forEach(function (childSnap) {
                    $scope.temp = childSnap.val();

                    console.log(childSnap.key);
                    console.log($scope.temp);
                    console.log($scope.temp.name);
                    console.log($scope.temp.email);
                    console.log($scope.temp.profile);
                    //achref.update();
                })
            });

        };
        //Archive student function - end

    }]);    //End of Dashboard controller
