angular.module('userService', [])

/*User Signup and fetching of all users*/
.factory('User', function($http){

	var userFactory = {};

	/*Creating a user signup*/
	userFactory.create = function(userData){
		return $http.post('/api/signup', userData);
	}

	/*Getting all users*/
	userFactory.all = function(){
		return $http.get('/api/users');
	}
	
	return userFactory;

});
