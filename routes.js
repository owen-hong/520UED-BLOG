var Home = require('./controllers/index');
var Admin = require('./controllers/admin');
var Passport = require('./controllers/passport');

var Rss = require('./controllers/rss.js');
var Site = require('./controllers/sitemap.js');

exports.handle = function(app) {

	//rss
  	app.get('/rss', Rss.index);
	app.get('/sitemap.xml', Site.index);

	/*
	*
	*	home
	*
	*/

	app.get('*', Home.global);

	app.get('/', Home.index);
	app.get('/ajaxArticle', Home.ajaxArticle);

	app.get('/article/:id', Home.article);

//	app.post('/article/doaddComment', Home.doaddComment);

	app.get('/addPraise', Home.addPraise);

	app.get('/search', Home.search);
	
	app.get('/category/:tags', Home.category);

	app.get('/tags/:tags', Home.tags);

	app.get('/cloudTags', Home.cloudTags);
	
	app.get('/f2e_job.html', Home.f2eJob);
	
	
	
	/*
	 *
	 *	admin
	 *
	 */

	/*登录权限控制*/
	app.get('/admin/' + '[^{login}^{register}]*',Passport.isLoggedIn);
	app.get('/admin/' + '(login)|(register)',Passport.checkNotLogin);
	
	
	//个人中心
	app.get('/admin/editUserCenter', Passport.isLoggedIn, Admin.userCenter);
	app.post('/admin/doEditUserCenter',Passport.isLoggedIn, Admin.doEditUserCenter);
    
    //修改密码
    app.get('/admin/editPassword', Passport.isLoggedIn, Admin.changPassword);
	app.post('/admin/doChangPassword', Passport.isLoggedIn, Admin.doChangPassword);
    

	//搜索
	app.get('/admin/search', Admin.search);

	
	//首页
	app.get('/admin',Passport.isLoggedIn);
	app.get('/admin', Admin.index);
	
	//文章列表
	app.get('/admin/article', Admin.article);

	//添加文章
	app.get('/admin/add',Admin.addArt);
	app.post('/admin/artPost',Admin.doArtPost);

	//编辑文章
	app.get('/admin/editArt',Admin.editArt);

	//更新文章
	app.post('/admin/editUpdate',Admin.doEditUpdate);

	//删除文章
	app.get('/admin/deletArt',Admin.deletArt);


	//添加分类
	app.get('/admin/classify',Admin.classify);
	app.get('/admin/addClass',Admin.addClass);
	app.post('/admin/doAddClass',Admin.doAddClass);

	//删除分类
	app.get('/admin/doRemoveClass',Admin.doRemoveClass);

	//更新分类updateClass
	app.get('/admin/updateClass',Admin.updateClass);
	app.post('/admin/doUpdateClass',Admin.doUpdateClass);


	//上传图片
	app.get('/admin/file',Admin.file);
	app.post('/admin/doUpload', Admin.doUpload);

	
	//添加友情链接
	app.get('/admin/linkList',Passport.isLoggedIn,Admin.linkList);
	
	app.get('/admin/addLink', Admin.addLink);
	app.post('/admin/doAddLink', Admin.doAddLink);
	
	app.get('/admin/doRemoveLinks', Admin.doRemoveLinks);
	
	app.get('/admin/updateLinks', Admin.updateLink);
	app.post('/admin/doUpdateLinks', Admin.doUpdateLinks);
	
	//添加tags
	app.get('/admin/tags', Passport.isLoggedIn, Admin.tags);
	
	app.get('/admin/addTags', Admin.addTags);
	app.post('/admin/doAddTags', Admin.doAddTags);
	
	app.get('/admin/doRemoveTags',Admin.doRemoveTags);

	/*passport*/
	app.get('/admin/register', Passport.register);
	app.post('/admin/doRegister', Passport.doRegister);

	//login
	app.get('/admin/login', Passport.login);
	app.post('/admin/doLogin', Passport.doLogin);
	
	//退出
	app.get('/admin/logout',Passport.logout);


	// Handle 404
	app.use(function(req, res) {
	    res.status(404);
	    res.render('home/public/404.html',{
	        title:'404页面'
	    });
	});;
	
	// Handle 500
	// app.use(function(error, req, res, next) {
	//     res.status(500);
	//     res.render('home/public/404.html',{
	//         title:'500系统错误'
	//     });
	// });
};
