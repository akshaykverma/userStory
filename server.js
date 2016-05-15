/*require() --> refers the exports in the file*/  

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();

/*
creating an HTTP server yourself, instead of having Express create one for you 
is useful if you want to reuse the HTTP server,
for example to run socket.io within the same HTTP server instance.
However, app.listen() also returns the HTTP server instance
*/
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect(config.database, function(err){
	if(err){
		console.log(err);
	}else{
		console.log("Connected to the database");
	}
})

/*Parses the text as URL encoded data
 (which is how browsers tend to send form data from regular forms set to POST) 
 and exposes the resulting object (containing the keys and values) on req.body.
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

/*To serve static files such as images, CSS files, and JavaScript files, 
use the express.static built-in middleware function in Express.
Pass the name of the directory that contains the static assets to the 
express.static middleware function to start serving the files directly.
Now, you can load the files that are in the public directory:
e.g.
http://localhost:3000/images/kitten.jpg
*/
app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/api')(app, express, io);
app.use('/api', api);

console.log(__dirname);

app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/app/views/index.html');
});

http.listen(config.port, function(err){
	if(err){
		console.log(err);
	}else{
		console.log("Listening on port 3000");
	}
});