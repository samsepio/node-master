const express=require('express');
const morgan=require('morgan');
const mongoose=require('mongoose');
const path=require('path');
const multer=require('multer');
const uuid=require('uuid/v4');
const passport=require('passport');
const flash=require('connect-flash');
const session=require('express-session');
const {format}=require('timeago.js');
const engine=require('ejs');
const app=express();

mongoose.connect('mongodb+srv://walter:3219329910@database1-wegwd.mongodb.net/test?retryWrites=true&w=majority')
	.then(db => console.log('conectado a la base de datos'))
	.catch(error => console.log(error));

require('./passport/local-auth');

app.set('puerto',process.env.PORT || 8000);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'./views'));

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
	secret: uuid(),
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
	app.locals.signupMessage = req.flash('signupMessage');
	app.locals.signinMessage = req.flash('signinMessage');
	next();
});
const storage = multer.diskStorage({
	destination: path.join(__dirname,'public/img/uploads/'),
	filename: (req,file,cb,filename)=>{
		cb(null, uuid() + path.extname(file.originalname));
	}
});
app.use(multer({
	storage
}).single('image'));
//cremos una variable accesible desde cualquier lugar de nuestra aplicacion para usarla en nuestras vistas
app.use((req,res,next)=>{
	app.locals.format = format;
	next();
});
app.use(require('./routes'));

app.use(express.static(path.join(__dirname,'./public')));

app.listen(app.get('puerto'),()=>{
	console.log(`servidor ejecutandose en el puerto ${app.get('puerto')}`);
});
