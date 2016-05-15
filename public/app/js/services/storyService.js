angular.module('storyService', [])

	.factory('Story', function($http){

		var storyFactory = {};

		/*Fetching all stories of all users*/
		storyFactory.allStories = function(){
			return $http.get('/api/allStories');
		}

		/*Story creation*/
		storyFactory.create = function(storyData){
			return $http.post('/api/', storyData);
		}

		/*Fetching all stories for a specific user*/
		storyFactory.allStory = function(){
			return $http.get('/api/');
		}

		return storyFactory;
	})

	.factory('socketio', function($rootScope){

		var socket = io.connect();

		return {
			on : function(eventName, callback){
				socket.on(eventName, function(){
					var args = arguments;
					$rootScope.$apply(function(){
						callback.apply(socket, args);
					});
				});
			},
			
			emit : function(eventName, callback){
				socket.emit(eventName, data, function(){
					var args = arguments;
					$rootScope.$apply(function(){
						callback.apply(socket, args);
					});
				});
			}
		}
	});