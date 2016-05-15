angular.module('storyCtrl', ['storyService'])

	.controller('StoryController', function(Story, socketio){

		var self = this;

		/*Setting all stories*/
		Story.allStory()
			.then(function(response){

				self.stories = response.data;
			},
			function(error){
				console.log('Error in storyController allStory() : ' + error);
			});


		/*Story creation*/	
		self.createStory = function(){

			self.message = '';

			Story.create(self.storyData)
				.then(function(response){
					self.storyData = {};
					self.message = response.data.message;
				},
				function(error){
					console.log('Error in storyController create() : ' + error);
				});
		}

		socketio.on('story', function(data){
			self.stories.push(data);
		})		
	})

	.controller('AllStoriesController', function(stories, socketio){

		var self = this;
		self.stories = stories.data;

		socketio.on('story', function(data){
			self.stories.push(data);
		});

	});