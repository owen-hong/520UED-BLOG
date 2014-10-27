var crypto = require('crypto');

var Passport = require('../models/passportPost.js');

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;


//登录模块
passport.use('local', new LocalStrategy(

    function (username, password, done) {

    	var md5 = crypto.createHash('md5');
    	var Pass = md5.update(password).digest('base64');


        Passport.Finduser(username,function(err,user){

			if(user==""){
	    		return done(null, false, { message: 'Incorrect username.' });
	    	}

	        if (Pass !== user[0].password) {
	            return done(null, false, { message: 'Incorrect password.' });
	        }

	        return done(null, user[0].username);

		});
    }
));
//保存user对象
passport.serializeUser(function (user, done) {
    done(null, user);//可以通过数据库方式操作
});
//删除user对象
passport.deserializeUser(function (user, done) {
    done(null, user);//可以通过数据库方式操作
});

//登录后跳转
exports.doLogin = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
});


exports.register = function(req,res){
	res.render('public/register',{
        title:'管理员注册',
    });
}

exports.doRegister = function(req,res){

	//检查密码
    if (req.body['password-repeat'] != req.body['password']) {
        res.json({
			Mes:'两次输入的密码不一致'
		});
        // return res.redirect('/admin/register');
    }else{
    	var Email = req.body.email;
	    var Username = req.body.username;
		//生成口令的散列值
	    var md5 = crypto.createHash('md5');
	    var Passwords = md5.update(req.body.password).digest('base64');


	    var Register = new Passport({
	    	username : Username,
	    	email : Email,
	    	password : Passwords
	    })

	    Register.save(function(err,data){
	    	if(err){
	    		console.log(err);
	    		return false;
	    	}
	    	console.log(data);
	    })

		res.json({
			mes:'注册成功'
		});
    }
}
exports.login = function(req,res){
	res.render('public/login',{
        title:'管理员登录',
    });
}

//退出
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/admin/login');
};


//权限控制
exports.checkNotLogin = function(req,res,next){
    if(req.isAuthenticated()){
        req.flash('error','已登录');
        return res.redirect('/admin');
    }
    next();
}

exports.isLoggedIn = function(req, res, next) {
	Passport.findOne(req.user,function(err,data){
		if(err){
    		console.log(err);
    		return false;
    	}
		req.session.icon = data.icon;
		req.session.userId = data._id;
	});

    if (req.isAuthenticated())
        return next();
    res.redirect('/admin/login');
}