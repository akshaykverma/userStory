angular.module('appRoutes', ['ngRoute'])

/*resolve - {Object.<string, function>=} - An optional map of dependencies 
which should be injected into the controller. 
If any of these dependencies are promises, 
the router will wait for them all to be resolved or one to be rejected before the controller is instantiated. 
If all the promises are resolved successfully, 
the values of the resolved promises are injected and $routeChangeSuccess event is fired. 
If any of the promises are rejected the $routeChangeError event is fired. 
For easier access to the resolved dependencies from the template, 
the resolve map will be available on the scope of the route, 
under $resolve (by default)
or a custom name specified by the resolveAs property (see below). 
This can be particularly useful, 
when working with components as route templates.
*/

.config(function($routeProvider, $locationProvider){

	$routeProvider

		.when('/',{
			templateUrl : 'app/views/pages/home.html',
			controller : 'MainController',
			controllerAs : 'main'
		})
		.when('/login', {	
			templateUrl : 'app/views/pages/login.html'
		})
		.when('/signup', {	
			templateUrl : 'app/views/pages/signup.html'
		})
		.when('/allStories', {	
			templateUrl : 'app/views/pages/allStories.html',
			controller : 'AllStoriesController',
			controllerAs : 'story',
			resolve : {
				stories : function(Story){
					return Story.allStories();
				}
			}
		});
	
	$locationProvider.html5Mode(true);	
})