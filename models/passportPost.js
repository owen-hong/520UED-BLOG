var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

//定义数据库字段,data是定义数据库的字段属性
var PersonSchema = new Schema({
	username : {
		type: String,
		required : true,
		unique: true
	},
	email : {
		type: String,
		required : true,
		unique: true
	},
	password:{
		type: String,
		required : true,
	},
	// 创建时间
	created: {
	    type: Date,
	    default: Date.now
	},
	icon : {
		type: String,
		default : '/images/owen.jpg'
	}
});

//
PersonSchema.statics.Finduser  = function(username,callback){
	return this.find({
		username : username
	},callback);
}

//update指定ID信息
PersonSchema.statics.ArtUpdateId = function(id,data,callback){
	return this.findByIdAndUpdate(id,{ $set:data },callback);
}
//删除文章ID
PersonSchema.statics.deletArtId = function(id,callback){
	return this.findByIdAndRemove(id,callback);
}

module.exports = mongodb.mongoose.model('passport', PersonSchema);
