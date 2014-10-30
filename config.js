var path = require('path');
//常用配置文件
var config = {
    faviconPath: path.join(__dirname, '/public/images/favicon.ico'),
    port: 3000,
    debug: false,
	dbHost:'mongodb://127.0.0.1/UED',
    db: {
        cookieSecret: 'UED',
        db: 'UED',
        host: 'localhost',
        port: 27017,
        username: '',
        password: ''
    },
    // RSS
    rss: {
        title: '前端开发-520UED巴士站',
        keywords: 'web前端开发工程师,前端开发,node.js教程,div+css,html5,html5网站,html5教程,jquery mobile,jquery mobile教程,html5是什么,CSS3,jQuery,sencha touch教程,前端招聘,javascript,js,520UED前端开发',
        description: '520UED是一个专注于前端开发资讯分享,前端交互效果js插件分享的,各浏览器之间兼容性bug解决方法分享。同时也关注最新的html5,css3,javascript,jquery资讯.我们也关注前端对用户体验带来的体验,关注UED,希望能有更多的前端高手能加入到520UED，分享自己的平时工作累积的有趣问题.站长联系邮箱:520UED.com@gmail.com',
        link: 'http://520UED.com/',
        language: 'zh-cn',
        author: 'owen',
        //最多获取的RSS Item数量
        max_rss_items: 50
    },
    //文章每页显示条数
    topic: {
        listRows: 10,
    },
    //评论每页显示条数
    comment: {
        listRows: 10,
    }
}

module.exports = config;