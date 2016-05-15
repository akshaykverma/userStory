/*Everything in Mongoose starts with a Schema. 
Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
*/

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	username: {type: String, required: true, index: { unique: true}},	
	password: {type: String, required: true, select: false},	
});

/*Password hashing using bcrypt*/
UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(error, hash){
		if(error) return next(error);

		user.password = hash;
		next(); 
	});
});

/*Password comparision use bcrypt*/
UserSchema.methods.comparePassword = function(password){
	var user = this;
	return bcrypt.compareSync(password, user.password);
}


module.exports = mongoose.model('User', UserSchema);