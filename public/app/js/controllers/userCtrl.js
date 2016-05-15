angular.module('userCtrl', [])

/*Handling of fetching of all users.*/
.controller('UserController', function(User){

	var self = this;

	User.all()
		.then(function(response){
			self.users = response.data;
		},	
		function(error){
			console.log('error userController() : ' + error);
		});

})

/*Handling of user signup and storing message,
setting of token and redirection to main page.*/
.controller('UserCreateController', function(User, $location, $window){

	var self = this;

	self.signupUser = function(){
		self.message = '';

		User.create(self.userData)
			.then(function(response){
				self.userData = {};
				self.message = response.data.message;

				//Setting the token
				$window.localStorage.setItem('token', response.data.token);
				$location.path('/');
			},
			function(error){
				console.log('Error in UserCreateController : ' + error);
			})
	}

});

