const express=require('express');
const User=require('../model/database');
const Image=require('../model/database2');
const path=require('path');
const passport=require('passport');
const {unlink}=require('fs-extra');
const router=express.Router();

router.get('/',(req,res,next)=>{
	res.render('index');
});
router.get('/signup',(req,res,next)=>{
	res.render('signup');
});
router.post('/signup',passport.authenticate('local-signup',{
	successRedirect: '/profile',
	failureRedirect: '/signup',
	passReqToCallback: true
}));
router.get('/signin',(req,res,next)=>{
	res.render('signin');
});
router.post('/signin',passport.authenticate('local-signin',{
	successRedirect: '/directory',
	failureRedirect: '/signin',
	passReqToCallback: true
}));
router.get('/profile',async(req,res,next)=>{
	res.render('profile');
});
router.get('/directory',async(req,res,next)=>{
	const images = await Image.find();
	res.render('directory',{
		images
	});
});
router.post('/profile',async(req,res,next)=>{
	const image = new Image();
	image.title = req.body.title;
	image.description = req.body.description;
	image.descript = req.body.descript;
	image.name = req.body.name;
	image.favorite = req.body.favorite;
	image.year = req.body.year;
	image.religion = req.body.religion;
	image.fieldname = req.file.fieldname;
	image.filename = req.file.filename;
	image.originalname = req.file.originalname;
	image.path = '/img/uploads/'+req.file.filename;
	image.size = req.file.size;
	image.mimetype = req.file.mimetype;
	image.encoding = req.file.encoding;
	await image.save();
	console.log(image);
	res.redirect('/directory');
});
router.get('/like/:id',async(req,res,next)=>{
	const image = await Image.findById(req.params.id);
	image.status = !image.status;
	await image.save();
	res.redirect('/directory');
});
router.get('/delete/:id',async(req,res,next)=>{
	const {id} = req.params;
	const image = await Image.findByIdAndDelete(id);
	unlink(path.resolve('./src/public/'+image.path));
	res.redirect('/directory');
});
router.get('/img/:id',async(req,res,next)=>{
	const images = await Image.findById(req.params.id);
	res.render('perfil',{
		images
	});
});

module.exports=router;
