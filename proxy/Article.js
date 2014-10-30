var Article = require('../models/artPost.js');


//查询指定id一条数据
exports.findOne = function (id, callback) {
    Article.findOne({
            _id: id
        },
        callback
    );
}

//查询所有文章
exports.findAll = function (fields, skip, count, callback) {
    var opts = {
        skip: skip,
        limit: count,
        sort: {
            created: 'desc', // asc desc
            // updated : 'desc'
            // _id : -1
        }
    };

    Article.find(null, fields, opts, callback);
}

//查询所有文章数量
exports.findCount = function (callback) {
    Article.count(null,callback);
}

//查询指定分类的文章
exports.findCategory = function (name, callback) {
    Article.find({
            classify: name
        },
        callback
    );
}


//查询tags
exports.findTags = function (name, callback) {
    Article.find({
            tags: name
        },
        callback
    );
}


//模糊查询,搜索查询
exports.searchTitle = function (title, callback) {
    var query={};
	query['title'] = new RegExp(title);
    
    Article.find(query,callback);
}


//update指定ID信息
exports.updateById = function (id, data, callback) {
    
    console.log(data);
    
    Article.findByIdAndUpdate(id,{ $set:data },callback);
}


//删除指定id的数据
exports.removeById = function (id, callback) {
    Article.findByIdAndRemove(id,callback);
}


//保存文章
exports.newAndSave = function (opts, callback) {
	var article = new Article();
	
	article.title = opts.title;
	article.keywords =  opts.keywords;
	article.description =  opts.description;
	article.author =  opts.author;
	article.authorIcon =  opts.authorIcon;
	article.imgUrl =  opts.imgUrl;
	article.classify =  opts.classify;
	article.Content =  opts.Content;
	article.tags =  opts.tags;
	article.userId =  opts.userId;
	
	article.save(callback);
};









