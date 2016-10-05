/**
 * Created by Winnie Lew on 9/28/2016.
 */
angular.module('StudentDashboard', ['ngMaterial'])

    .controller('StudentDashCtrl', function($scope) {
        $scope.imagePath = 'Images/background.jpg';
    })
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
        $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
        $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
        $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    });