angular.module('mainCtrl', [])

.controller('MainController', function($rootScope, $location, Auth){

	var self = this;

	self.loggedIn = Auth.isLoggedIn();

	/*Getting the login status and user information on every change in url*/
	$rootScope.$on('$routeChangeStart', function(){

		self.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data){
				self.user = data.data;
			},
			function(error){
				self.loggedIn = false;
				console.log("Error in MainController getUser : " + error)
			});
	});

	self.doLogin = function(){

		self.processing = true;
		self.error = '';

		Auth.login(self.loginData.username, self.loginData.password)
			.then(function(data){
				
				self.processing = true;
						
				Auth.getUser()
					.then(function(data){
						self.user = data.data;
					},
					function(error){
						self.loggedIn = false;
						console.log("Error in MainController getUser doLogin(): " + error)
					});

				if(data.data.success){
					$location.path('/');
				}else{
					error = data.data.message;
				}

			});
	}

	self.doLogout = function(){
		Auth.logout();
		$location.path('/logout');
	}

});