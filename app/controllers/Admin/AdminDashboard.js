/**
 * Created by DHINA on 10/2/2016.
 */
/**
 * Created by DHINA on 9/28/2016.
 */
'use strict';

angular.module('G1.AdminDashboard', ['ngRoute', 'angularUtils.directives.dirPagination', '720kb.datepicker'])

    .controller('AdminDashboardCtrl', ['$cookies', '$cookieStore', function ($cookies, $cookieStore) {

        (function initController() {

            $cookieStore.put("user", "dhina");
            var value = $cookieStore.get("user");
            alert(value);

        })();

    }]);    //End of Dashboard controller
