var Tags = require('../models/tagsPost.js');


//查询所有数据
exports.findAll = function (callback) {
    Tags.find(null, callback);
}


//update指定ID信息
exports.updateById = function (id, data, callback) {
    Tags.findByIdAndUpdate(id, {
        $set: data
    }, callback);
}

//删除指定id的数据
exports.removeById = function (id, callback) {
    Tags.findByIdAndRemove(id, callback);
}

//保存
exports.newAndSave = function (opts, callback) {
	var tags = new Tags();
	
	tags.keywords =  opts.keywords;
	
	tags.save(callback);
};


















