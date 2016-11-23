/**
 * Created by PorYee on 2/10/2016.
 */
'use strict';

angular.module('G1.login', ['ngMaterial', 'ngRoute', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Login', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        });

    }])

    .controller('loginCtrl', ['$rootScope', '$scope', '$firebaseObject', '$firebaseArray', '$location', '$localStorage', '$filter', '$mdDialog',
        function ($rootScope, $scope, $firebaseObject, $firebaseArray, $location, $localStorage, $filter, $mdDialog) {

            //if there isnt any login detail
            if ($localStorage.credential == null) {
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
            $scope.Changepassword = function (newPasswordDetails) {

                //getting current date
                var currentDate = $filter('date')(new Date(), 'dd/MM/yyyy');
                //TODO: need to get current user's key and input here

                //can use $localStorage.userid to get key

                userRef.child($localStorage.userid).on("value", function (snap) {
                    //if old password matches change the password
                    if (newPasswordDetails.oldpassword == snap.val().password) {
                        //TODO: need to get current user's key and input here
                        userRef.child($localStorage.userid).update({
                            password: newPasswordDetails.newpassword,
                            passwordChangedDate: currentDate
                        });
                    }
                    else {

                    }

                });
            }


            $scope.login = function () {
                /*
                 //find child that has key email == to the email passed in
                 userRef.orderByChild("email").equalTo($scope.email).on("value", function(snap){
                 //TODO: Do something when the password ain't the same
                 }
                 });
                 }
                 $scope.login = function () {
                 /*
                 //find child that has key email == to the email passed in
                 userRef.orderByChild("email").equalTo($scope.email).on("value", function(snap){

                 //loop into children incase there is more than 1 return
                 snap.forEach(function (childSnap) {
                 //check if the account was deactivated due to not changing password after 100 days
                 if(childSnap.val().accountStatus != "Deactivated") {
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
                 }
                 })

                 //get the first child object
                 //var myUser = snap.val();

                 //console.log(JSON.stringify(myUser));
                 });
                 */
                //auto sign in as dhina to save time
                userRef.orderByChild("email").equalTo($scope.email).once("value", function (snap) {


                    //loop into children incase there is more than 1 return
                    snap.forEach(function (childSnap) {
                        //check if the account was deactivated due to not changing password after 100 days
                        if(childSnap.val().accountStatus != "Deactivated") {

                            //check if email and password is the same
                            if ((childSnap.val().password) == $scope.password) {


                                var successfullogin = true;
                                //Checks if user has 2fa authentication

                                if (childSnap.val().secretkey) {
                                    $scope.fbsecret = childSnap.val().secretkey;


                                    $scope.fbotp = updateOtp($scope.fbsecret);
                                    setInterval(timermatch, 1000);

                                    successfullogin = false;
                                    var confirm = $mdDialog.prompt()
                                        .title('2FA Authentication')
                                        .textContent('Enter your generated 6 digit secret token')
                                        .placeholder('Secret Token')
                                        .ok('Save')
                                        .cancel('Cancel');

                                    $mdDialog.show(confirm).then(function (result) {
                                        //check if result matches

                                        //check if valid token
                                        if ($scope.fbotp == result) {
                                            successfullogin = true;
                                            console.log('Login process')
                                            //route to dashboard
                                            if (childSnap.val().role == 'admin'){
                                                $location.path('AdminDashboard');
                                            }
                                            else if (childSnap.val().role == 'hod'){
                                                $location.path('Hod');
                                            }
                                            else if (childSnap.val().role == 'lecturer'){
                                                $location.path('Lecturer');
                                            }
                                            else if (childSnap.val().role == 'student'){
                                                $location.path('StudentDashboard');
                                            }

                                            // $location.path('Dashboard');
                                        }


                                    }, function () {
                                        //else do nothing
                                    });
                                }


                                //for persistent
                                $localStorage.userid = childSnap.key;
                                $localStorage.credential = childSnap.val();
                                $localStorage.studentCredential = snap.val();


                                //for the view
                                $rootScope.userData = $localStorage.credential;
                                $rootScope.studentData = $localStorage.studentCredential;


                                if (successfullogin) {
                                    //update hidden
                                    $scope.$parent.updateHidden(1);
                                    //route to dashboard
                                    if (childSnap.val().role == 'admin'){
                                        $location.path('AdminDashboard');
                                    }
                                    else if (childSnap.val().role == 'hod'){
                                        $location.path('Hod');
                                    }
                                    else if (childSnap.val().role == 'lecturer'){
                                        $location.path('Lecturer');
                                    }
                                    else if (childSnap.val().role == 'student'){
                                        $location.path('StudentDashboard');
                                    }

                                }


                            }
                        }
                    })

                    //get the first child object
                    //var myUser = snap.val();

                    //console.log(JSON.stringify(myUser));
                });


            }


            function dec2hex(s) {
                return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
            }

            function hex2dec(s) {
                return parseInt(s, 16);
            }

            function base32tohex(base32) {
                var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
                var bits = "";
                var hex = "";

                for (var i = 0; i < base32.length; i++) {
                    var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
                    bits += leftpad(val.toString(2), 5, '0');
                }

                for (var i = 0; i + 4 <= bits.length; i += 4) {
                    var chunk = bits.substr(i, 4);
                    hex = hex + parseInt(chunk, 2).toString(16);
                }
                return hex;

            }

            function leftpad(str, len, pad) {
                if (len + 1 >= str.length) {
                    str = Array(len + 1 - str.length).join(pad) + str;
                }
                return str;
            }

            function updateOtp(secretkey) {

                var key = base32tohex(secretkey);
                var epoch = Math.round(new Date().getTime() / 1000.0);
                var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');

                // updated for jsSHA v2.0.0 - http://caligatio.github.io/jsSHA/
                var shaObj = new jsSHA("SHA-1", "HEX");
                shaObj.setHMACKey(key, "HEX");
                shaObj.update(time);
                var hmac = shaObj.getHMAC("HEX");

                $('#qrImg').attr('src', 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/ICT3103G1@host.com%3Fsecret%3D' + $('#secret').val());
                $('#secretHex').text(key);
                $('#secretHexLength').text((key.length * 4) + ' bits');
                if (hmac == 'KEY MUST BE IN BYTE INCREMENTS') {
                    $('#hmac').append($('<span/>').addClass('label important').append(hmac));
                } else {
                    var offset = hex2dec(hmac.substring(hmac.length - 1));
                    var part1 = hmac.substr(0, offset * 2);
                    var part2 = hmac.substr(offset * 2, 8);
                    var part3 = hmac.substr(offset * 2 + 8, hmac.length - offset);
                    if (part1.length > 0) $('#hmac').append($('<span/>').addClass('label label-default').append(part1));
                    $('#hmac').append($('<span/>').addClass('label label-primary').append(part2));
                    if (part3.length > 0) $('#hmac').append($('<span/>').addClass('label label-default').append(part3));
                }

                var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
                otp = (otp).substr(otp.length - 6, 6);

                //save to firebase
                return otp

            }

            function timer() {
                var epoch = Math.round(new Date().getTime() / 1000.0);
                var countDown = 30 - (epoch % 30);
                if (epoch % 30 == 0) {
                    var otp = updateOtp($scope.secretkey);
                    $('#otp').text(otp);
                }
                $('#updatingIn').text(countDown);

            }

            function timermatch() {
                var epoch = Math.round(new Date().getTime() / 1000.0);
                var countDown = 30 - (epoch % 30);
                if (epoch % 30 == 0) {
                    $scope.fbotp = updateOtp($scope.fbsecret);
                    console.log($scope.fbotp);
                }

            }


            $scope.mysubmit = function (secretkey) {
                //store secretkey to firebase


                //update firebase
                //if field was updated and not empty
                var updated = false;
                //if secretkey is valid
                if (secretkey) {
                    userRef.child($localStorage.userid).update({secretkey: secretkey});
                    updated = true;
                }

                //update view
                var otp = updateOtp($scope.secretkey);
                $('#otp').text(otp);

                setInterval(timer, 1000);
                /*
                 $('#update').click(function (event) {
                 updateOtp();
                 event.preventDefault();
                 });

                 $('#secret').keyup(function () {
                 updateOtp();
                 });
                 */
            }


        }]);


