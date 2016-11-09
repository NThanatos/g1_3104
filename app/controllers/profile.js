/**
 * Created by PorYee on 2/10/2016.
 */
'use strict';

angular.module('G1.profile', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker', 'firebase'])

    .controller('profileCtrl', ['$rootScope', '$localStorage', '$scope', '$firebaseObject', '$firebaseArray',
        function ($rootScope, $localStorage, $scope, $firebaseObject, $firebaseArray) {
            const rootRef = firebase.database().ref();
            //point to the obj under courses
            const userref = rootRef.child('Users');

            (function initController() {

                $scope.profilealert = true;
                //$cookieStore.put("user", "dhina");
                //var value = $cookieStore.get("user");
                $scope.account = $rootScope.userData;
            })();

            //pass data from user ng-model
            $scope.submit_form = function (user, profile) {


                //update firebase
                //if field was updated and not empty
                var updated = false;
                var checkemail=$scope.account.email;
                if (user) {
                    userref.child($localStorage.userid).update(user);

                    //double check email incase user change their email address
                    if(user.hasOwnProperty('email')){
                        checkemail=user.email;
                    }
                    updated = true;
                }

                //if field was updated and not empty
                if (profile) {
                    userref.child($localStorage.userid + "/profile").update(profile);
                    updated = true;
                }

                if (updated) {
                    //update cookie

                    userref.orderByChild("email").equalTo(checkemail).on("value", function (snap) {

                        $scope.profilealert = false;

                        //loop into children incase there is more than 1 return
                        snap.forEach(function (childSnap) {

                            console.log(childSnap.val());

                            //store entire user into userData shared across all controllers
                            //$rootScope.userData = childSnap.val();
                            //success=true;

                            //for persistent
                            $localStorage.credential = childSnap.val();
                            $localStorage.studentCredential = snap.val();


                            //for the view
                            $rootScope.userData = $localStorage.credential;
                            $rootScope.studentData = $localStorage.studentCredential;


                        })
                    })
                }
                else{
                    alert("No Changes");
                }


            }

            $scope.alert = function () {
                $scope.profilealert = true;
            }


        }]);    //End of Dashboard controller

