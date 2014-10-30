/*
 * GET home page.
 *
 */
var Config = require('../config.js');

var Article = require('../proxy/Article.js');
var Classify = require('../proxy/Classify.js');
var Tags = require('../proxy/Tags.js');
var Links = require('../proxy/Links.js');


//公共头尾数据输出
exports.global = function (req, res, next) {
    Classify.findAll(function (err, data) {

        //分类数据输出
        res.locals({
            ClassPosts: data
        });

        //友情链接数据输出
        Links.findAll(function (err, Ldata) {
            if (err) {
                return res.send(err);
            }
            res.locals({
                LinkPosts: Ldata
            });
            next();
        });
    });
}

exports.index = function (req, res) {
    var listRows = 9;

    //数据开始位置
    var start = 0;

    var fields = 'title created updated author classify imgUrl authorIcon addPraise clickCount';

    Article.findAll(fields, start, listRows, function (err, data) {
        res.render('home/index', {
            title: Config.rss.title,
            keywords: Config.rss.keywords,
            description: Config.rss.description,
            posts: data
        });
    });
};

exports.ajaxArticle = function (req, res) {
    Article.findCount(function (err, count) {
        var listRows = 9;
        var maxPage = Math.ceil(count / listRows);
        var currentPage = req.query.page <= 0 ? 1 : req.query.page;

        //数据开始位置
        var start = (currentPage - 1) * listRows;
        var fields = 'title created updated author classify imgUrl authorIcon addPraise clickCount';

        Article.findAll(fields, start, listRows, function (err, data) {
            res.json({
                posts: data
            });
        });
    });
};

//文章详情
exports.article = function (req, res) {
    var id = req.params.id;
    var start = 0;
    var listRows = 10;
    var fields = 'title _id';
    var arry = [];

    Article.findAll(fields, start, listRows, function (err, sideData) {
        if (err) {
            return res.send(err);
        }

        sideData.forEach(function (i, v) {
            arry.push(i);
        });

        var resuft = getArrayItems(arry, listRows);
        Article.findOne(id, function (err, data) {
            var viewCount = data.clickCount + 1;
			
            Article.updateById(id, {
                clickCount: viewCount
            }, function (err, data) {
                if (err) {
                    res.render('home/public/404.html', {
                        title: '404页面'
                    });
                }
                res.render('home/article', {
                    posts: data,
                    siderbar: resuft,
                    viewCount: viewCount,
                    "layout": false
                });
            });
        });
    });
}

//点赞
exports.addPraise = function (req, res) {
    var id = req.query.id;
    Article.findOne(id, function (err, data) {
        var Praise = parseInt(data.addPraise) + 1;
        var updataData = {
            addPraise: Praise
        }
        Article.updateById(id, updataData, function (err, posts) {
            res.json({
                site: posts.addPraise,
                type: true
            })
        });
    });
}

//search
exports.search = function (req, res) {
    var title = req.query.content;
    Article.searchTitle(title, function (err, data) {
        if (err) {
            return res.send(err);
        }
        res.render('home/search', {
            title: '关键词' + title,
            pageType: '搜索页面',
            keywords: Config.rss.keywords,
            description: Config.rss.description,
            posts: data,
        });
    });
}

//分类页面
exports.category = function (req, res) {
    var tags = req.params.tags;
    Article.findCategory(tags, function (err, data) {
        if (err) {
            res.render('home/public/404.html', {
                title: '404页面',
                keywords: Config.rss.keywords,
                description: Config.rss.description,
            });
        }

        if (data != "") {
            res.render('home/search', {
                title: tags + '-前端开发-520UED',
                pageType: '分类页面',
                classify: tags,
                keywords: Config.rss.keywords,
                description: Config.rss.description,
                posts: data,
            });
        } else {
            res.render('home/public/404.html', {
                title: '404页面',
                keywords: Config.rss.keywords,
                description: Config.rss.description,
            });
        }
    })
}

//分类页面
exports.tags = function (req, res) {
    var tags = req.params.tags;
    Article.findTags(tags, function (err, data) {
        if (err) {
            res.render('home/public/404.html', {
                title: '404页面',
                keywords: Config.rss.keywords,
                description: Config.rss.description,
            });
        }
        if (data != "") {
            res.render('home/search', {
                title: tags + '-前端开发-520UED',
                pageType: 'tag页面',
                classify: tags,
                keywords: Config.rss.keywords,
                description: Config.rss.description,
                posts: data,
            });
        } else {
            res.render('home/public/404.html', {
                title: '404页面',
                keywords: Config.rss.keywords,
                description: Config.rss.description,
            });
        }
    })
}

//标签云
exports.cloudTags = function (req, res) {
    Tags.findAll(function (err, data) {
        if (err) {
            res.render('home/public/404.html', {
                title: '404页面',
                keywords: Config.rss.keywords,
                description: Config.rss.description,
            });
            return false;
        }
        res.render('home/cloudTags', {
            title: '标签云',
            keywords: Config.rss.keywords,
            description: Config.rss.description,
            posts: data
        });
    });
}
//前端招聘
exports.f2eJob = function (req, res) {
    res.render('home/f2e_job', {
        title: '前端招聘,深圳前端招聘',
        keywords: "深圳前端招聘,前端招聘,前端人才",
        description: "深圳前端招聘,前端招聘,前端人才",
        posts: ""
    });
}



//随机赛选出数据
function getArrayItems(arr, num) {
    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
    var temp_array = new Array();

    for (var index in arr) {
        temp_array.push(arr[index]);
    }

    //取出的数值项,保存在此数组
    var return_array = new Array();

    for (var i = 0; i < num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length > 0) {
            //在数组中产生一个随机索引
            var arrIndex = Math.floor(Math.random() * temp_array.length);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
        } else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return return_array;
}