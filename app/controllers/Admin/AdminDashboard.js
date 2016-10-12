/**
 * Created by DHINA on 10/2/2016.
 */
/**
 * Created by DHINA on 9/28/2016.
 */
'use strict';

angular.module('G1.AdminDashboard', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('AdminDashboardCtrl', ['$rootScope', '$localStorage', function ($rootScope, $localStorage) {

        (function initController() {

            //$cookieStore.put("user", "dhina");
            //var value = $cookieStore.get("user");
            //var user=$rootScope.userData;


            console.log("welcome "+$rootScope.userData.role);

        })();

    }]);    //End of Dashboard controller
