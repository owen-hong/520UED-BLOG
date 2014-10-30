var Classify = require('../models/classPost.js');


//查询指定id一条数据
exports.findOne = function (id, callback) {
    Classify.findOne({
            _id: id
        },
        callback
    );
}


//查询所有数据
exports.findAll = function (callback) {
    Classify.find(null, callback);
}


//update指定ID信息
exports.updateById = function (id, data, callback) {
    Classify.findByIdAndUpdate(id, {
        $set: data
    }, callback);
}


//删除指定id的数据
exports.removeById = function (id, callback) {
    Classify.findByIdAndRemove(id, callback);
}


//删除二级分类
exports.removeSubById = function (id,subId, callback) {
	Classify.findById(id,function(err,posts){
		if (err) {
			return res.send(err);
		}
		
		for(var i =0;i < posts.subClassify.length;i++){
			if(posts.subClassify[i]._id == subId){
				posts.subClassify.splice(i,1);
			}
		}

		posts.save(callback);
	});
}

//保存子分类
exports.newAndSave = function (opts, callback) {
	var classify = new Classify();
	
	classify.classify = opts.classify;
	classify.classKey =  opts.classKey;
	classify.subClassify =  [
		{
			subName: opts.subClassify.subName,
			subKey: opts.subClassify.subKey
		}
	];
	
	classify.save(callback);
};


//保存子分类
exports.subClassSave = function (opts, callback) {
	
	Classify.findById(opts.classifyId,function(err,posts){
		
		if (err) {
			return res.send(err);
		}

		posts.subClassify.push({
			subName : opts.subName,
			subKey : opts.subKey
		});
		
		posts.save(callback);
	});
}

