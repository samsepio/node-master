const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User=require('../model/database');

passport.serializeUser((user,done) => {
	done(null,user.id);
});

passport.deserializeUser(async(id,done) => {
	const user = await User.findById(id);
	done(null,user);
});

passport.use('local-signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},async(req,email,password,done) => {
	const user = await User.findOne({email: email});
	if(user){
		done(null,false,req.flash('signupMessage','ya hay un usuario con ese email'));
	}else{
		const newUser = new User(req.body);
        	newUser.email = email;
        	newUser.password = newUser.encryptPassword(password);
        	await newUser.save();
        	console.log(newUser);
        	done(null,newUser);
	}
}));

passport.use('local-signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},async(req,email,password,done) => {
	const user = await User.findOne({email: email});
	if(!user){
		return done(null,false,req.flash('signinMessage','El Correo No Esta Registrado'));
	}
	if(!user.comparePassword(password)){
		return done(null,false,req.flash('signinMessage','Contraseña Incorrecta'));
	}
	done(null,user);
}));
