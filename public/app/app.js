angular.module('myApp', ['appRoutes', 'mainCtrl', 'authService', 'userService', 'userCtrl', 'storyCtrl', 'reverseFilter'])

.config(function($httpProvider){

	$httpProvider.interceptors.push('AuthInterceptor');

});

