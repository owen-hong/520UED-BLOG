/*
 * GET home page.
 * res.render("index",{"layout":false}); 禁用layout
 */

var crypto = require('crypto');
var ArtPost = require('../models/artPost.js');
var ClassPost = require('../models/classPost.js');
var LinksPost = require('../models/linksPost.js');
var CommentPost = require('../models/commentPost.js');
var PassportPost = require('../models/passportPost.js');

var TagsPost = require('../models/tagsPost.js');

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
        var fields = 'title created updated author classify clickCount';

        ArtPost.ArtFindAll(null,start,listRows,fields,function(err,persons){
            CommentPost.count(function(i,num){
                if(persons==""){
                    console.log("数据为空!");
                    res.render('admin/article',{
                        title:'文章首页',
                        nullTip :'查询不到数据！',
                        posts:"",
                        commentList : num
                    });
                }else{
                    res.render('admin/index',{
                        title:'首页',
                        currentPage : currentPage,
                        maxPage : maxPage,
                        posts:persons,
                        nullTip : "",
                        commentList : num
                    });
                }
            });

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
        var fields = 'title created updated author classify clickCount';
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
    //查询分类
    ClassPost.classFindAll(function(err,data){
        if(err){
            console.log(err.message);
            res.json({
                err : err.message
            });
            return false;
        }

        //查询tags
        TagsPost.FindAll(function(err,TagsData){
            if(err){
                console.log(err.message);
                res.json({
                    err : err.message
                });
                return false;
            }
            res.render('admin/add',{
                title:'添加文章',
                subClass : data,
                tags : TagsData
            });
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

};

//编辑文章
exports.editArt = function(req, res){
    ArtPost.Findone(req.query.artId,function(err,persons){
        if(err){
            console.log(err.message);
            res.json({
                err : err.message
            });
            return false;
        }
        ClassPost.classFindAll(function(err,data){
            if(err){
                console.log(err.message);
                res.json({
                    err : err.message
                });
                return false;
            }
            //查询tags
            TagsPost.FindAll(function(err,TagsData){
                if(err){
                    console.log(err.message);
                    res.json({
                        err : err.message
                    });
                    return false;
                }   

                //T除已选中的数据，输出位选中的数据
                var checkTags = persons.tags.split(',');
                var TagsArr = [];
                TagsData.forEach(function(tagpost,idx){
                    TagsArr.push(tagpost.keywords);
                });
                checkTags.forEach(function(cTagsPost){
                    TagsArr.forEach(function(tagpost,idx){
                        if(tagpost==cTagsPost){
                            TagsArr.splice(idx,1);  
                        }
                    });
                });

                res.render('admin/edit',{
                    title : '编辑文章',
                    posts : persons ,
                    subClass : data ,
                    tags : TagsArr
                });
            });
        });
    });
}
//更新文章
exports.editUpdate = function(req,res){
    if(req.body.tags===undefined){
        var tags = "";
    }else{
        var tags = req.body.tags;
    }

    var data = {
        title : req.body.title,
        keywords : req.body.keywords,
        description : req.body.description,
        author : req.body.author,
        authorIcon : req.session.icon,
        imgUrl : req.body.imgUrl,
        classify : req.body.classify,
        Content : req.body.Content,
        updated : new Date(),
        tags : tags
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
//分类列表
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
                    subKey: req.body.subKey
                }
            ]
        });

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

//更新分类
exports.updateClass = function(req, res){
    var id = req.query.classId;

    ClassPost.ArtFindId(id,function(err,data){
		console.log(data);
        res.render('admin/editClass',{
            title:'编辑分类',
            posts : data
        });
    });
}
exports.doUpdateClass = function(req, res){
	var $id = req.body.oneId;
	var subName = req.body.subClass;
	var subKey = req.body.subKey;
	var subId = req.body.subId;
	
	if(typeof subName ==="string"){
		var subClassify_arr = {subName : subName,subKey:subKey,_id:subId}
	}else{
		var subClassify_arr = [];
		for(var i=0;i<subName.length;i++){
			var sub_arr = {};
			sub_arr.subName = subName[i];
			sub_arr.subKey = subKey[i];
			sub_arr._id = subId[i];
			subClassify_arr.push(sub_arr);
		}
	}

	var data = {
		classify : req.body.oneClass,
		classKey : req.body.oneKey,
		subClassify : subClassify_arr
	}
	
	ClassPost.UpdateId($id,data,function(err,posts){
		if(err){
        	console.log(err);
            return res.redirect('/admin/classify');
        }
		
		res.redirect('/admin/classify');
	});
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
//添加友情链接
exports.addLink = function(req, res){

    res.render('admin/addLink',{
        title:'添加友情链接',
        posts : '',
		update: false
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

//更新友情链接
exports.updateLink = function(req, res){
	var $id = req.query.id;
	
	LinksPost.ArtFindId($id,function(err,data){
        if(err){
            console.log(err);
            return false;
        }
        res.render('admin/addLink',{
			title:'编辑友情链接',
			posts : data,
			update: true
		});
    });
}
exports.doUpdateLinks = function(req,res){
	var keyword = req.body.keyword;
    var link = req.body.links;
    var concacts = req.body.concact;
	var $id = req.body.linkId;
	
	var data = {
		keywords : req.body.keyword,
		links : req.body.links,
		concact : req.body.concact
	}

	LinksPost.UpdateId($id,data,function(err,posts){
		if(err){
        	console.log(err);
            return res.redirect('/admin/addLink');
        }
//		console.log(posts);
		res.redirect('/admin/linkList');
	});
}

//删除友情链接
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
    TagsPost.FindAll(function(err,data){
        if(err){
            console.log(err.message);
            res.json({
                err : err.message
            });
            return false;
        }
        res.render('admin/tagsList',{
            title:'标签列表',
            posts:data
        });
    });
}
exports.addTags = function(req,res){
    res.render('admin/addTags',{
        title:'添加标签',
    });
}
//添加tags
exports.doAddTags = function(req,res){
    var keywords = req.body.keyword;


    var addTags = new TagsPost({
        keywords :keywords
    });

    addTags.save(function(err,data){
        if(err){
            console.log(err.message);
            res.json({
                err : err.message
            });
            return false;
        }

        res.redirect('admin/tags');
    });
}
//删除tags
exports.doRemoveTags = function(req,res){
    var id = req.query.id;
    TagsPost.DeletId(id,function(err,data){
        if(err){
            console.log(err.message);
            res.json({
                err : err.message
            });
            return false;
        }
        res.redirect('admin/tags');
    })
}

//个人中心
exports.userCenter = function(req,res){
	var userId = req.session.userId;
	
	PassportPost.FindOne(userId,function(err,data){
		res.render('admin/userCenter',{
			title:'个人中心',
			posts:data
		});
	});
}
exports.doEditUserCenter = function(req,res){
	
	var $id = req.body.userId;
	
	var data = {
		username : req.body.username,
		email : req.body.email,
		icon : req.body.imgUrl
	}
	
	PassportPost.UpdateId($id,data,function(err,posts){
		if(err){
        	console.log(err);
            return res.redirect('/admin/editUserCenter');
        }
		console.log(posts);
		res.redirect('/admin/editUserCenter');
	});
	
	
//	res.end();
}

//修改密码
exports.changPassword = function(req,res){
    
    res.render('admin/changePassword',{
        title:'修改密码',
    });
    
}

exports.doChangPassword = function(req,res){
    var md5 = crypto.createHash('md5');
	var md5_2 = crypto.createHash('md5');
	var oldPassword = req.body.oldPassword;
	var Pass = md5.update(oldPassword).digest('base64');
	
	var userId = req.session.userId;
	var newPassword = req.body.password;
	var newRePassword = req.body.rePassword;
	var newPass = md5_2.update(newRePassword).digest('base64');
	
	PassportPost.FindOne(userId,function(err,posts){
		if(err){
        	console.log(err);
            return res.redirect('/admin/doChangPassword');
        }
		
		if(Pass == posts.password){
			if(newPassword !== newRePassword){
				res.send("两次密码输入不一致，请重新输入");
			}else{
				
				var data = {
					password : newPass
				};
				
				PassportPost.UpdateId(userId,data,function(err,upPosts){
					res.send("密码重置成功，请返回!");
				});
			}
		}else{
			res.send("旧密码验证错误，请返回重新输入");
		}
	});
}





























