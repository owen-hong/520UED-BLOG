
/*
 * GET home page.
 * res.render("index",{"layout":false}); 禁用layout
 */


var crypto = require('crypto');
var ArtPost = require('../models/artPost.js');
var ClassPost = require('../models/classPost.js');
var LinksPost = require('../models/linksPost.js');
var CommentPost = require('../models/commentPost.js');

var fs = require('fs');

//首页
exports.index = function(req, res){
    ArtPost.count(null,function(err,count){

        if (err) {
          return exceptionHandler().handleError(err, req, res);
        }

        //每页展示数量
        var listRows = 10;

        var maxPage = Math.ceil(count/listRows);
        var currentPage = req.query.page || 1;

        if(currentPage == 0){
            currentPage = 1;
        }
        //数据开始位置
        var start = (currentPage - 1) * listRows;


        //查询
        var fields = 'title created updated author classify';
        ArtPost.ArtFindAll(null,start,listRows,fields,function(err,persons){

            if(persons==""){
                console.log("数据为空!");
                res.render('admin/article',{
                    title:'文章首页',
                    nullTip :'查询不到数据！',
                    posts:""
                });
            }else{
                res.render('admin/index',{
                    title:'首页',
                    currentPage : currentPage,
                    maxPage : maxPage,
                    posts:persons,
                    nullTip : "",
                });
            }
        });
    });
};

//文章列表
exports.article = function(req, res){

    ArtPost.count(null,function(err,count){

        if(err){
            console.log(err);
        }

        //每页展示数量
        var listRows = 10;

        var maxPage = Math.ceil(count/listRows);
        var currentPage = req.query.page || 1;

        if(currentPage == 0){
            currentPage = 1;
        }
        //数据开始位置
        var start = (currentPage - 1) * listRows;


        //查询
        var fields = 'title created updated author classify';
        ArtPost.ArtFindAll(null,start,listRows,fields,function(err,data){

            if(data==""){
                console.log("数据为空!");
                res.render('admin/article',{
                    title:'文章首页',
                    nullTip :'查询不到数据！',
                    posts:"",
                });
            }else{
                res.render('admin/article',{
                    title:'文章列表',
                    currentPage : currentPage,
                    maxPage : maxPage,
                    posts:data,
                    nullTip : "",
                });
            }
        });
    });

};

//添加文章
exports.addArt = function(req,res){
    ClassPost.classFindAll(function(err,data){
        res.render('admin/add',{
            title:'添加文章',
            subClass : data
        });
    });
};

//保存文章
exports.artPost = function(req, res){
    var data = {
        title : req.body.title,
        keywords : req.body.keywords,
        description : req.body.description,
        author : req.body.author,
        authorIcon : req.session.icon,
        imgUrl : req.body.imgUrl,
        classify : req.body.classify,
        Content : req.body.Content,
        tags : req.body.tags
    }
    //保存数据
    var Post = new ArtPost(data);
    Post.save(function(err,person){
        if(err){
            console.log("发布错误:" + err);
        }
        console.log(person);
    });

    res.send("<h2>发布成功！两秒后回到首页！</h2><script>setTimeout(function(){window.location.href='/admin/article';},2000);</script>");

    // res.end();
};

//编辑文章
exports.editArt = function(req, res){

    ArtPost.Findone(req.query.artId,function(err,persons){

        ClassPost.classFindAll(function(err,data){
            res.render('admin/edit',{
                title : '编辑文章',
                posts : persons,
                subClass : data
            });
        });
    });

}
//更新文章
exports.editUpdate = function(req,res){
    var data = {
        title : req.body.title,
        keywords : req.body.keywords,
        description : req.body.description,
        author : req.body.author,
        imgUrl : req.body.imgUrl,
        classify : req.body.classify,
        Content : req.body.Content,
        updated : new Date(),
        tags : req.body.tags
    }

    ArtPost.ArtUpdateId(req.query.artId,data,function(err,persons){
        if(err){
            console.log(err);
        }
        res.redirect('/admin/article')
    });
}

//删除文章
exports.deletArt = function(req,res){
    ArtPost.deletArtId(req.query.artId,function(err,persons){
        console.log(err);
        console.log(persons);

        res.redirect('/admin/article');
    });
}

//上传图片
exports.file = function(req, res){
	res.render('admin/file',{
        title:'文件上传',
    });
}

//文件上传
exports.doUpload = function(req,res){
    var urlPath = [];
    for (var i in req.files) {
        if (req.files[i].size == 0){
            // 使用同步方式删除一个文件
            fs.unlinkSync(req.files[i].path);
            console.log('Successfully removed an empty file!');
        } else {

            var tpm_type = req.files[i].type.split("/")[1];
            var tpm_date = (Date.parse(new Date())/1000) + (Math.round(Math.random()*9999));
            var target_path = './public/uploads/' + tpm_date + '.' + tpm_type;
            var patharray = target_path.split("/");
            var openUrl = patharray[patharray.length-2] +'/'+ patharray[patharray.length-1];

            urlPath.push(openUrl);

            console.log(openUrl);

            // 使用同步方式重命名一个文件
            fs.renameSync(req.files[i].path, target_path);
            console.log('Successfully renamed a file!');
        }
    }
    // res.redirect('/admin/file');
    res.json({
        Url : urlPath,
    });
}


//分类列表
exports.classify = function(req, res){
    ClassPost.classFindAll(function(err,data){
        res.render('admin/classify',{
            title:'分类列表',
            posts : data,
            subClass : data.subClassify
        });
    }); 
}
//添加分类
exports.addClass = function(req, res){

    ClassPost.classFindAll(function(err,data){
        res.render('admin/addClass',{
            title:'添加分类',
            posts : data
        });
    });
}
//添加分类
exports.doAddClass = function(req, res){

    if(req.body.classify == "1"){
        var addClass = new ClassPost({
            classify: req.body.oneClass,
            classKey: req.body.oneKey,
            subClassify :[
                {
                    subName : req.body.subClass,
                    subkey: req.body.subKey
                },
            ]
        });
        console.log(req.body.classify);
        addClass.save(function(err,data){
            if(err){
                console.log(err);
                return false;
            }
            console.log(data);
        });

        res.redirect('/admin/classify');

    }else{

        var classify = req.body.classify;
        var subClass = req.body.subClass;
        var subKey = req.body.subKey;

        ClassPost.classSave(classify,subClass,subKey,function(err,data){
            if(err){
                return;
            }
            console.log(data);
            res.redirect('/admin/classify');
        });
    }
}
//删除分类
exports.doRemoveClass = function(req, res){
    var classId = req.query.classId;
    var subId = req.query.subClass;
    
    if(!subId){

        ClassPost.deletClass(classId,function(err,data){
            if(err){
                console.log(err);
                return false;
            }
            console.log(data);
        })
    }else{
        ClassPost.removeSub(classId,subId,function(err,data){
            if(err){
                console.log(err);
                return false;
            }
            console.log(data);
        });
    }
    res.redirect('/admin/classify');
}
//友情链接
exports.linkList = function(req, res){

    LinksPost.FindAll(function(err,data){
        if(err){
            console.log(err);
            return false;
        }

        res.render('admin/linkList',{
            title:'友情列表',
            posts : data
        });
    });
}

exports.addLink = function(req, res){

    res.render('admin/addLink',{
        title:'添加友情链接',
        posts : ''
    });
}
//添加
exports.doAddLink = function(req, res){
    
    var keyword = req.body.keyword;
    var link = req.body.links;
    var concacts = req.body.concact;


    var addlinks = new LinksPost({
        keywords : keyword,
        links : link,
        concact : concacts
    });

    addlinks.save(function(err,data){
        if(err){
            console.log(err.message);
            return res.redirect('/admin/addLink');
        }
        console.log(data);
    });

    res.redirect('/admin/linkList');
}

//删除
exports.doRemoveLinks = function(req,res){
    var $id = req.query.id;

    LinksPost.deletId($id,function(err,data){
        if(err){
            console.log(err.message);
            return false;
        }
        console.log(data);

        res.redirect('/admin/linkList');
    });
}

//留言列表
exports.comment = function(req,res){

    CommentPost.count(null,function(err,count){
        if(err){
            console.log(err);
        }

        //每页展示数量
        var listRows = 10;

        var maxPage = Math.ceil(count/listRows);
        var currentPage = req.query.page || 1;

        if(currentPage == 0){
            currentPage = 1;
        }
        //数据开始位置
        var start = (currentPage - 1) * listRows;


        //查询
        var fields = 'arttitle username Email comment commentTime reply website';
        CommentPost.ComFindAll(null,start,listRows,fields,function(err,data){
            if(data==""){
                res.render('admin/comment',{
                    title:'留言列表',
                    nullTip :'查询不到留言！',
                    posts:"",
                });
            }else{
                res.render('admin/comment',{
                    title:'留言列表',
                    currentPage : currentPage,
                    maxPage : maxPage,
                    posts:data,
                    nullTip : "",
                });
            }
        });

    });
}
//回复留言
exports.replyComment = function(req,res){
    var CommentId = req.query.comId,
        userIcon = req.body.icon;

    CommentPost.findId(CommentId,function(err,data){
        if(err){
            console.log(err.message);
            res.json({
                err : err.message
            });
            return false;
        }
        res.render('admin/replyComment',{
            title:'回复留言',
            posts : data,
            icon : req.session.icon
        });
    });
}
exports.doreplyComment = function(req,res){
    var opts = {
        icon : req.body.icon,
        author : req.user,
        contents : req.body.contents
    };
    var CommentId = req.body.comId;

    CommentPost.reply(CommentId,opts,function(err,data){
        if(err){
            console.log(err.message);
            res.json({
                err : err.message
            });
            return false;
        }
        res.redirect("/admin/comment");
    });
}
exports.Commentdelet = function(req,res){
    var CommentId = req.query.comId;
    CommentPost.delet(CommentId,function(err,data){
        if(err){
            console.log(err.message);
            res.json({
                err : err.message
            });
            return false;
        }
        res.redirect("/admin/comment")
    });
}

//添加评论
exports.addComment = function(req,res){
    res.render('admin/addComment',{
        title:'添加评论',
    });
}
exports.doaddComment = function(req,res){
    var artId = req.body.artid,
        artTitle = req.body.arttil,
        userName = req.body.username,
        Email = req.body.email,
        webSite = req.body.website,
        Content = req.body.content;

    var addComment = new CommentPost({
        arttitle : artTitle,
        artid : artId,
        username :userName,
        Email : Email,
        website :webSite,
        comment : Content
    });

    addComment.save(function(err,data){
        if(err){
            console.log(err.message);
            res.json({
                err : err.message
            });
            return false;
        }
        res.redirect('admin/comment');
    });

}
//搜索页面
exports.search = function(req,res){
    var title = req.query.content;

    ArtPost.searchFind(title,function(err,data){
        if(err){
            console.log(err);
            return false;
        }

        if(data==""){
            res.render('admin/search',{
                title:'搜索结果列表',
                posts:data,
                nullTip : "没有查询到匹配的数据",
            });
        }else{
            res.render('admin/search',{
                title:'搜索结果列表',
                posts:data,
                nullTip : "",
            });
        }

    });
}
//tags
exports.tags = function(req,res){
    res.render('admin/tags',{
        title:'标签列表',
    });
}