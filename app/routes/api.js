var User = require('../models/user');
var config = require('../../config'); 
var Story =  require('../models/story');
var jsonwebtoken = require('jsonwebtoken');

var secretKey = config.secretKey;

/*Token creation using JWT*/
function createToken(user){
	var token = jsonwebtoken.sign({
					_id : user._id,
					name : user.name,
					username : user.username
				}, secretKey, {
					expiresIn : '5m'
				});

	return token;
}

/*Exporting the whole api*/
module.exports = function(app, express, io){
	var api = express.Router();

	/*Getting all stories*/
	api.get('/allStories', function(req, res){
		Story.find({}, function(error, stories){
			
			if(error){
				res.send(error);
				return;
			}
			res.json(stories);
		});
	})

	/*User Signup*/ 
	api.post('/signup', function(req, res){
		var user = new User({
			name : req.body.name,
			username : req.body.username,
			password : req.body.password
		});

		var token = createToken(user);

		user.save(function(error){
			if(error){
				res.send(error);
				return;
			}
			res.json({
				success : true,
				token : token,
				message : 'User has been created!'
			});
		});
	});

	/*Fetching all users*/
	api.get('/users', function(req, res){
		User.find({}, function(error, users){
			if(error){
				res.send(error);
				return;
			}

			res.json(users);
		});
	});

	/*User login*/ 
	api.post('/login', function(req, res){
		User.findOne({
			username : req.body.username
		}).select('name username password').exec(function(error, user){
			if(error) throw error;

			if(!user){
				res.send({message : 'User doesnt exist'});
			}else if(user){
				var validPassword = user.comparePassword(req.body.password);	
				
				if(!validPassword){
					res.send({message : 'Invalid Password'});
				}else{

					//token
					var token = createToken(user);

					res.json({
						success : true,
						message : 'Successfull login!',
						token : token
					});
				}
			}
		});
	});


	/*Token Authentication Middleware*/
	/*Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.
	The next middleware function is commonly denoted by a variable named next.
	Middleware functions can perform the following tasks:

	1. Execute any code.
	2. Make changes to the request and the response objects.
	3. End the request-response cycle.
	4. Call the next middleware function in the stack.*/

	api.use(function(req, res, next){

		console.log('Someone entered the app!');

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];
		
		if(token){
			jsonwebtoken.verify(token, secretKey, function(error, decoded){
				if(error){
					return res.status(403).send({success : false, message : 'Failed to authenticate the user'});
				
				}else{
					req.decoded = decoded;
					next(); 	 	
				} 
			});
		}else{			
			return res.status(403).send({success : false, message : 'No token provided'});
		}		
	});

	/*Anything below this would be required to pass through
	  the above created middleware. */

	  api.route('/')

		.post(function(req, res){

			console.log('Post req.decoded._id : ' + req.decoded._id);
		
			var story = new Story({
				creator : req.decoded._id,
				content : req.body.content
			});

			story.save(function(error, newStory){
				if(error){
					res.send(error);
					return;
				}

				/*Emits an event to all connected clients.*/ 
				io.emit('story', newStory);
				
				res.json({ 
					message : 'New Story Created!'
				});				
			});
		})

		.get(function(req, res){

			console.log('Get req.decoded._id : ' + req.decoded._id);
		
			Story.find({creator : req.decoded._id}, function(error, stories){
				if(error){
					res.send(error);
					return;
				}
				res.json(stories);
			});

		}); 						  	

		/*Accessing the decoded user data for angular js*/ 
		api.get('/me', function(req, res){
			res.json(req.decoded);
		});

	return api;
}

