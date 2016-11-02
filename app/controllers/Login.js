/**
 * Created by PorYee on 2/10/2016.
 */
'use strict';

angular.module('G1.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Login', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        });

    }])

    .controller('loginCtrl', ['$rootScope', '$scope', '$firebaseObject', '$firebaseArray', '$location', '$localStorage',
        function ($rootScope, $scope, $firebaseObject, $firebaseArray, $location, $localStorage) {

        //if there isnt any login detail
        if($localStorage.credential==null){
            console.log("hide");
            $scope.$parent.updateHidden(0);
        }

        //get the entire database tree
        const rootRef = firebase.database().ref();



        //zoom in to users table
        const userRef = rootRef.child('Users');


        //noticed that object is suitable for json
        this.userobj = $firebaseObject(userRef);



        //this allows us to use the array and the scope notation we are used to
        $scope.usertable = $firebaseArray(userRef);

        $scope.login = function () {
            /*
             //find child that has key email == to the email passed in
             userRef.orderByChild("email").equalTo($scope.email).on("value", function(snap){

             //loop into children incase there is more than 1 return
             snap.forEach(function (childSnap) {
             //check if email and password is the same
             if((childSnap.val().password)==$scope.password){
             console.log("Welcome "+$scope.email);

             //store entire user into userData shared across all controllers
             $rootScope.userData = childSnap.val();
             //success=true;

             //update hidden
             $scope.$parent.updateHidden(1);
             //route to dashboard
             $location.path('AdminDashboard')
             }
             })

             //get the first child object
             //var myUser = snap.val();

             //console.log(JSON.stringify(myUser));
             });
             */
            //auto sign in as dhina to save time
            userRef.orderByChild("email").equalTo("dhin@email.com").on("value", function (snap) {

                console.log(snap.key)

                //loop into children incase there is more than 1 return
                snap.forEach(function (childSnap) {
                    //check if email and password is the same
                    if ((childSnap.val().password) == "testpass") {
                        console.log("Welcome " + $scope.email);

                        //store entire user into userData shared across all controllers
                        //$rootScope.userData = childSnap.val();
                        //success=true;

                        //for persistent
                        $localStorage.credential= childSnap.val();
                        $localStorage.studentCredential = snap.val();


                        //for the view
                        $rootScope.userData = $localStorage.credential;
                        $rootScope.studentData = $localStorage.studentCredential;


                        //update hidden
                        $scope.$parent.updateHidden(1);


                        //route to dashboard
                        $location.path('Dashboard')


                    }
                })

                //get the first child object
                //var myUser = snap.val();

                //console.log(JSON.stringify(myUser));
            });


        }

    }]);

