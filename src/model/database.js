const mongoose=require('mongoose');
const bcrypt=require('bcrypt-nodejs');
const Schema=mongoose.Schema;

const userSchema = new Schema({
	email:{type: String},
	user:{type: String},
	password:{type: String}
});

module.exports=mongoose.model('users',userSchema);
