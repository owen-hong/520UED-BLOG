/*
 * GET home page.
 * res.render("index",{"layout":false}); 禁用layout
 */

var crypto = require('crypto');
var moment = require('moment');
var fs = require('fs');

var Article = require('../proxy/Article.js');
var Classify = require('../proxy/Classify.js');
var Tags = require('../proxy/Tags.js');
var Links = require('../proxy/Links.js');
var Passport = require('../proxy/Passport.js');

//首页
exports.index = function (req, res) {
    Article.findCount(function (err, count) {
        if (err) {
            return res.send(err);
        }

        //每页展示数量
        var listRows = 10;
        var maxPage = Math.ceil(count / listRows);
        var currentPage = req.query.page == 0 ? 1 : req.query.page;

        //数据开始位置
        var start = (currentPage - 1) * listRows;

        //查询
        var fields = 'title created updated author classify clickCount';

        Article.findAll(fields, start, listRows, function (err, posts) {
            if (err) {
                return res.send(err);
            }
            if (posts == "") {
                res.render('admin/article', {
                    title: '文章首页',
                    nullTip: '暂无数据！',
                    posts: ""
                });
            } else {
                res.render('admin/index', {
                    title: '首页',
                    currentPage: currentPage,
                    maxPage: maxPage,
                    posts: posts,
                    nullTip: ""
                });
            }
        });
    });
};

//搜索接口
exports.search = function (req, res) {
    var title = req.query.content;

    Article.searchTitle(title, function (err, posts) {
        if (err) {
            return res.send(err);
        }

        if (posts == "") {
            res.render('admin/search', {
                title: '搜索结果列表',
                posts: posts,
                nullTip: "没有查询到匹配的数据"
            });
        } else {
            res.render('admin/search', {
                title: '搜索结果列表',
                posts: posts,
                nullTip: ""
            });
        }
    });
}


//文章列表
exports.article = function (req, res) {
    Article.findCount(function (err, count) {
        if (err) {
            return res.send(err);
        }

        //每页展示数量
        var listRows = 10;
        var maxPage = Math.ceil(count / listRows);
        var currentPage = req.query.page <= 0 ? 1 : req.query.page;

        //数据开始位置
        var start = (currentPage - 1) * listRows;

        //查询
        var fields = 'title created updated author classify clickCount';

        Article.findAll(fields, start, listRows, function (err, posts) {
            if (err) {
                return res.send(err);
            }
            if (posts == "") {
                res.render('admin/article', {
                    title: '文章首页',
                    nullTip: '暂无数据！',
                    posts: ""
                });
            } else {
                res.render('admin/index', {
                    title: '首页',
                    currentPage: currentPage,
                    maxPage: maxPage,
                    posts: posts,
                    nullTip: ""
                });
            }
        });
    });
};

//添加文章
exports.addArt = function (req, res) {

    //查询分类
    Classify.findAll(function (err, posts) {
        if (err) {
            return res.send(err);
        }

        //查询tags
        Tags.findAll(function (err, TagsPosts) {
            if (err) {
                return res.send(err);
            }
            res.render('admin/add', {
                title: '添加文章',
                subClass: posts,
                tags: TagsPosts
            });
        });
    });
};

//保存文章
exports.doArtPost = function (req, res) {
    var data = {
        title: req.body.title,
        keywords: req.body.keywords,
        description: req.body.description,
        author: req.session.userName,
        authorIcon: req.session.icon,
        imgUrl: req.body.imgUrl,
        classify: req.body.classify,
        Content: req.body.Content,
        tags: req.body.tags,
        userId: req.session.userId
    }

    //保存数据
    Article.newAndSave(data, function (err, posts) {
        if (err) {
            return res.send(err);
        }
        res.send("<h2>发布成功！两秒后回到首页！</h2><script>setTimeout(function(){window.location.href='/admin/article';},2000);</script>");
    });
};

//编辑文章
exports.editArt = function (req, res) {

    Article.findOne(req.query.artId, function (err, persons) {
        if (err) {
            return res.send(err);
        }

        Classify.findAll(function (err, data) {

            if (err) {
                return res.send(err);
            }

            //查询tags
            Tags.findAll(function (err, TagsData) {
                if (err) {
                    return res.send(err);
                }
				
                //T除已选中的数据，输出位选中的数据
                var checkTags = persons.tags ? persons.tags.split(',') : [];
                var TagsArr = [];
				
                TagsData.forEach(function (tagpost, idx) {
                    TagsArr.push(tagpost.keywords);
                });
				
                checkTags.forEach(function (cTagsPost) {
                    TagsArr.forEach(function (tagpost, idx) {
                        if (tagpost == cTagsPost) {
                            TagsArr.splice(idx, 1);
                        }
                    });
                });

                res.render('admin/edit', {
                    title: '编辑文章',
                    posts: persons,
                    subClass: data,
                    tags: TagsArr
                });
            });
        });
    });
}
exports.doEditUpdate = function (req, res) {

    if (req.body.tags === undefined) {
        var tags = "";
    } else {
        var tags = req.body.tags;
    }

    var data = {
        title: req.body.title,
        keywords: req.body.keywords,
        description: req.body.description,
        author: req.session.userName,
        authorIcon: req.session.icon,
        imgUrl: req.body.imgUrl,
        classify: req.body.classify,
        Content: req.body.Content,
        updated: new Date(),
        tags: tags,
        userId: req.session.userId
    }
    

    Article.updateById(req.query.artId, data, function (err, posts) {
        if (err) {
            return res.send(err);
        }

        res.redirect('/admin/article');
    });
}

//删除文章
exports.deletArt = function (req, res) {
    Article.removeById(req.query.artId, function (err, posts) {
        if (err) {
            return res.send(err);
        }
        res.redirect('/admin/article');
    });
}



//上传图片
exports.file = function (req, res) {
    res.render('admin/file', {
        title: '文件上传',
    });
}

//文件上传
exports.doUpload = function (req, res) {
    var urlPath = [];
    var $time = moment(new Date()).format('YYYYMMDD');
    var newFileRoad = './public/uploads/' + $time;

    for (var i in req.files) {
        if (req.files[i].size == 0) {
            // 使用同步方式删除一个文件
            fs.unlinkSync(req.files[i].path);
            console.log('Successfully removed an empty file!');
        } else {
            var tpm_type = req.files[i].type.split("/")[1];
            var tpm_date = (Date.parse(new Date()) / 1000) + (Math.round(Math.random() * 9999));

            //创建当前日期的目录存放图片
            if (!fs.existsSync(newFileRoad)) {
                fs.mkdirSync(newFileRoad);
                console.log('Common目录创建成功');
            }

            var target_path = './public/uploads/' + $time + '/' + tpm_date + '.' + tpm_type;
            var openUrl = 'uploads/' + $time + '/' + tpm_date + '.' + tpm_type;

            urlPath.push(openUrl);

            // 使用同步方式重命名一个文件
            var readStream = fs.createReadStream(req.files[i].path);
            var writeStream = fs.createWriteStream(target_path);
            readStream.pipe(writeStream);

            console.log('Successfully renamed a file!');
        }
    }

    res.json({
        Url: urlPath
    });
}




//分类列表
exports.classify = function (req, res) {
    Classify.findAll(function (err, posts) {
        if (err) {
            return res.send(err);
        }

        res.render('admin/classify', {
            title: '分类列表',
            posts: posts,
            subClass: posts.subClassify
        });
    });
}

//添加分类
exports.addClass = function (req, res) {
    Classify.findAll(function (err, posts) {
        if (err) {
            return res.send(err);
        }
        res.render('admin/addClass', {
            title: '添加分类',
            posts: posts
        });
    });
}
exports.doAddClass = function (req, res) {
    if (req.body.classify == "1") {
        var options = {
            classify: req.body.oneClass,
            classKey: req.body.oneKey,
            subClassify: {
                subName: req.body.subClass,
                subKey: req.body.subKey
            }
        };

        Classify.newAndSave(options, function (err, posts) {
            if (err) {
                return res.send(err);
            }
            res.redirect('/admin/classify');
        });

    } else { //添加二级分类
        var options = {
            classifyId: req.body.classify,
            subName: req.body.subClass,
            subKey: req.body.subKey
        }

        Classify.subClassSave(options, function (err, posts) {
            if (err) {
                return res.send(err);
            }
            res.redirect('/admin/classify');
        });
    }
}

//更新分类
exports.updateClass = function (req, res) {
    Classify.findOne(req.query.classId, function (err, posts) {
        res.render('admin/editClass', {
            title: '编辑分类',
            posts: posts
        });
    });
}
exports.doUpdateClass = function (req, res) {
    var $id = req.body.oneId;
    var subName = req.body.subClass;
    var subKey = req.body.subKey;
    var subId = req.body.subId;

    if (typeof subName === "string") {
        var subClassify_arr = {
            subName: subName,
            subKey: subKey,
            _id: subId
        }
    } else {
        var subClassify_arr = [];
        for (var i = 0; i < subName.length; i++) {
            var sub_arr = {};
            sub_arr.subName = subName[i];
            sub_arr.subKey = subKey[i];
            sub_arr._id = subId[i];
            subClassify_arr.push(sub_arr);
        }
    }

    var data = {
        classify: req.body.oneClass,
        classKey: req.body.oneKey,
        subClassify: subClassify_arr
    }

    Classify.updateById($id, data, function (err, posts) {
        if (err) {
            return res.send(err);
        }

        res.redirect('/admin/classify');
    });
}

//删除分类
exports.doRemoveClass = function (req, res) {
    var classId = req.query.classId;
    var subId = req.query.subClass;

    if (!subId) {
        Classify.removeById(classId, function (err, posts) {
            if (err) {
                return res.send(err);
            }
            res.redirect('/admin/classify');
        });
    } else { // 删除二级分类
        Classify.removeSubById(classId, subId, function (err, posts) {
            if (err) {
                return res.send(err);
            }
            res.redirect('/admin/classify');
        });
    }
}



//友情链接
exports.linkList = function (req, res) {
    Links.findAll(function (err, posts) {
        if (err) {
            return res.send(err);
        }

        res.render('admin/linkList', {
            title: '友情列表',
            posts: posts
        });
    });
}

//添加友情链接
exports.addLink = function (req, res) {
    res.render('admin/addLink', {
        title: '添加友情链接',
        posts: '',
        update: false
    });
}
exports.doAddLink = function (req, res) {
    var options = {
        keywords: req.body.keyword,
        links: req.body.links,
        concact: req.body.concact
    };

    Links.newAndSave(options, function (err, posts) {
        if (err) {
            return res.send(err);
        }

        res.redirect('/admin/linkList');
    });
}

//编辑友情链接
exports.updateLink = function (req, res) {
    Links.findOne(req.query.id, function (err, posts) {
        if (err) {
            return res.send(err);
        }
        res.render('admin/addLink', {
            title: '编辑友情链接',
            posts: posts,
            update: true
        });
    });
}
exports.doUpdateLinks = function (req, res) {
    var $id = req.body.linkId;

    var data = {
        keywords: req.body.keyword,
        links: req.body.links,
        concact: req.body.concact
    }

    Links.updateById(req.body.linkId, data, function (err, posts) {
        if (err) {
            return res.send(err);
        }
        res.redirect('/admin/linkList');
    });
}

//删除友情链接
exports.doRemoveLinks = function (req, res) {
    Links.removeById(req.query.id, function (err, posts) {
        if (err) {
            return res.send(err);
        }
        res.redirect('/admin/linkList');
    });
}



//tags
exports.tags = function (req, res) {
    Tags.findAll(function (err, posts) {
        if (err) {
            return res.send(err);
        }
        res.render('admin/tagsList', {
            title: '标签列表',
            posts: posts
        });
    });
}

//添加tags
exports.addTags = function (req, res) {
    res.render('admin/addTags', {
        title: '添加标签'
    });
}
exports.doAddTags = function (req, res) {
    var options = {
        keywords: req.body.keyword
    };

    Tags.newAndSave(options, function (err, posts) {
        if (err) {
            return res.send(err);
        }

        res.redirect('admin/tags');
    });
}

//删除tags
exports.doRemoveTags = function (req, res) {
    Tags.removeById(req.query.id, function (err, posts) {
        if (err) {
            return res.send(err);
        }
        res.redirect('admin/tags');
    })
}



//个人中心
exports.userCenter = function (req, res) {
    
    console.log(req.session.userId);
    
    Passport.findOne(req.session.userId, function (err, posts) {
        if (err) {
            return res.send(err);
        }
        res.render('admin/userCenter', {
            title: '个人中心',
            posts: posts
        });
    });
}
//编辑个人中心
exports.doEditUserCenter = function (req, res) {
    var data = {
        username: req.body.username,
        email: req.body.email,
        icon: req.body.imgUrl
    };

    Passport.updateById(req.body.userId, data, function (err, posts) {
        if (err) {
            return res.send(err);
        }

        //同步文章表的用户信息
        var fields = 'userId _id';
        Article.findAll(fields, 0, null, function (err, artData) {
            var postDate = {
                author: data.username,
                authorIcon: data.icon
            }

            artData.forEach(function (posts) {
                //判断文章的作者ID是否等于当前登录的用户ID
                if (posts.userId == $id) {
                    Article.updateById(posts._id, postDate, function (err, upDate) {
                        if (err) {
                            res.send(err);
                        }

                    });
                }
            });
            res.redirect('/admin/editUserCenter');
        });
    });
}



//修改密码
exports.changPassword = function (req, res) {
    res.render('admin/changePassword', {
        title: '修改密码',
    });
}
exports.doChangPassword = function (req, res) {
    var md5 = crypto.createHash('md5');
    var md5_2 = crypto.createHash('md5');

    var oldPassword = req.body.oldPassword;
    var Pass = md5.update(oldPassword).digest('base64');

    var userId = req.session.userId;
    var newPassword = req.body.password;
    var newRePassword = req.body.rePassword;
    var newPass = md5_2.update(newRePassword).digest('base64');

    Passport.findOne(userId, function (err, posts) {
        if (err) {
            return res.send(err);
        }

        if (Pass == posts.password) {
            if (newPassword !== newRePassword) {
                res.send("两次密码输入不一致，请重新输入");
            } else {

                var data = {
                    password: newPass
                };

                Passport.updateById(userId, data, function (err, upPosts) {
                    res.send("密码重置成功，请返回!");
                });
            }
        } else {
            res.send("旧密码验证错误，请返回重新输入");
        }
    });
}