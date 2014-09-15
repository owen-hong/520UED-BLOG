
/**
 * Module dependencies.
 */

var express = require('express');
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

var routes = require('./routes');
var path = require('path');
var config = require('./config');

//CSRF防攻击
var csurf = require('csurf');

//日志log4js
var log4js = require('log4js');

//启动mongodb
var MongoStore = require('connect-mongo')(express);

//中间件
var partials = require('express-partials');
var flash = require('connect-flash');

//登录模块
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


//启动express框架
var app = express();


// all environments
app.set('port', config.port);


app.set('views', path.join(__dirname, 'views'));

//默认
// app.set('view engine', 'ejs');

// 更改模板引擎
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');


app.use(partials());
app.use(flash());


//网站图标
// var iconPath = path.join(__dirname, '/public/images/favicon.ico');
app.use(express.favicon(config.faviconPath));

app.use(express.logger('dev'));

app.use(express.methodOverride());
app.use(express.cookieParser());


//替代bodyParser
app.use(express.json());
app.use(express.urlencoded());
app.use(require('connect-multiparty')());



//启动数据库
app.use(express.session({
  	secret: config.db.cookieSecret,
  	store: new MongoStore({
  		  db : config.db.db
  	}, function() {
  		  console.log('connect mongodb success...');
  	}),
  	cookie : {
  		  maxAge : 60000 * 20	//20 minutes
  	},
}));

//启动passport登录组件
app.use(passport.initialize());
app.use(passport.session());


//静态中心
app.use(express.static(path.join(__dirname, 'public')));


//设置全局时间控件
app.locals.moment = require('moment');


if (!config.debug) {

    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    //开启csrf防攻击
    app.use(csurf());

    // 视图缓存
    app.set('view cache', true);

}else{

    //开启csrf防攻击
    app.use(csurf());

    console.log("debug");
}

//开启csrf防攻击
app.use(function (req, res, next) {
  res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
  res.locals.userName = req.user;
  next();
});

//启动log4js日志
log4js.configure({
      appenders: [
          { type : 'console' },
          {
            type: 'file', //文件输出
            filename: 'logs/access.log',
            maxLogSize: 1024,
            backups:3,
            category: 'normal' 
          }
      ],
      //以[INFO] console代替console默认样式
      replaceConsole: true
});

var logger = log4js.getLogger('default');
//log4js的输出级别6个: trace, debug, info, warn, error, fatal
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {
        level:'aoto',
        format:':method :url'
    }
));

//启动路由中心
routes.handle(app);



//启动服务器
if (!config.debug) {
  
    //生成模式
    http.createServer(app).listen(app.get('port'),function(){
        console.log('Node listening on port:' + app.get('port'));
    });

}else{
    //调试模式
    http.createServer(app).listen(app.get('port'),function(){
        console.log('Node listening on port:' + app.get('port'));
    });

}
