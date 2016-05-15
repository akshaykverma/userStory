/*User Authentication*/
angular.module('authService', [])


.factory('Auth', function($http, $q, AuthToken){

	var authFactory = {};

	/*User login*/ 
	authFactory.login = function(username, password){
		
		return $http.post('/api/login', {
			username : username,
			password : password
		})
		.then(function(data){
			AuthToken.setToken(data.data.token);
			return data;
		},
		function(error){
			console.error('Error while login : ' + error);
			return error;
		});
	}

	/*Logging the user out*/
	authFactory.logout = function(){
		AuthToken.setToken();
	}

	/*Checking whether the use is loggedIn*/ 
	authFactory.isLoggedIn = function(){
		if(AuthToken.getToken()){
			return true;
		}else{
			return false;
		}
	}

	/*Getting the user info using the token*/
	authFactory.getUser = function(){
		if(AuthToken.getToken()){
			return $http.get('/api/me');
		}else{
			return $q.reject({ message : 'User has no token'});
		}
	}

	return authFactory;
})

/*Setting and getting the token*/
.factory('AuthToken', function($window){

	var authTokenFactory = {};

	/*Getting the token from windows local storage*/ 
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}

	/*Setting the token if present else removing it*/ 
	authTokenFactory.setToken = function(token){
		if(token){
			$window.localStorage.setItem('token', token);		
		}
		else{
			$window.localStorage.removeItem('token');	
		}
	}

	return authTokenFactory;
})

/*Request Interceptor to check for token in each request*/
.factory('AuthInterceptor', function($q, $location, AuthToken){

	var authInterceptor = {};

	/*Adding token in the request config*/ 
	authInterceptor.request = function(config){
		var token = AuthToken.getToken();

		if(token){
			config.headers['x-access-token'] = token;
		}
		return config;
	}

	/*Checking response error*/
	authInterceptor.responseError = function(response){
		if(response.status == 403){
			$location.path('/login');
		}
		return $q.reject(response);
	}

	return authInterceptor;
});

