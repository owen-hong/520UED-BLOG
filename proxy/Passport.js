var Passport = require('../models/passportPost.js');

//查询所有数据
exports.findAll = function (callback) {
    Passport.find(null, callback);
}

//查询指定id一条数据
exports.findOne = function (id, callback) {
    Passport.findOne({
            _id: id
        },
        callback
    );
}

//查询指定id一条数据
exports.findUser = function (username, callback) {
    Passport.findOne({
            username: username
        },
        callback
    );
}


//update指定ID信息
exports.updateById = function (id, data, callback) {
    Passport.findByIdAndUpdate(id, {
        $set: data
    }, callback);
}

//删除指定id的数据
exports.removeById = function (id, callback) {
    Passport.findByIdAndRemove(id, callback);
}

//保存
exports.newAndSave = function (opts, callback) {
	var passport = new Passport();
	
	passport.username =  opts.username;
	passport.email =  opts.email;
	passport.password =  opts.password;
	
	passport.save(callback);
};















