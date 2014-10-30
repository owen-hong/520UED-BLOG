var Links = require('../models/linksPost.js');

//查询所有数据
exports.findAll = function (callback) {
    Links.find(null, callback);
}

//查询指定id一条数据
exports.findOne = function (id, callback) {
    Links.findOne({
            _id: id
        },
        callback
    );
}

//update指定ID信息
exports.updateById = function (id, data, callback) {
    Links.findByIdAndUpdate(id, {
        $set: data
    }, callback);
}

//删除指定id的数据
exports.removeById = function (id, callback) {
    Links.findByIdAndRemove(id, callback);
}

//保存
exports.newAndSave = function (opts, callback) {
	var links = new Links();
	
	links.keywords =  opts.keywords;
	links.links =  opts.links;
	links.concact =  opts.concact;
	
	links.save(callback);
};















