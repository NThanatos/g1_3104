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

            //$cookieStore.put("user", "dhina");
            //var value = $cookieStore.get("user");
            //var user=$rootScope.userData;

        })();

        //Archive student function
        $scope.archiveStudent = function() {
            console.log("Starting student archive")
            const rootRef = firebase.database().ref();
            const ref = rootRef.child('Users');
            //todays year -3
            var year = new Date().getFullYear() - 3
            ref.orderByChild("yearJoined").equalTo(year).on("value", function (snap) {
                //for each student that is required to achieve
                snap.forEach(function (childSnap) {
                    $scope.temp = childSnap.val();
                    //insert one obj into firebase
                    firebase.database().ref('archive/'+ childSnap.key).update({
                        name: $scope.temp.name,
                        email:$scope.temp.email,
                        yearJoined:$scope.temp.yearJoined,
                        profile: $scope.temp.profile
                    })
                    //remove here
                    firebase.database().ref('Users/'+ childSnap.key).remove()
                })
            });

        };
        //Archive student function - end

    }]);    //End of Dashboard controller
