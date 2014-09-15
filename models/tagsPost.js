var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;


//定义数据库字段,data是定义数据库的字段属性
var PersonSchema = new Schema({
	keywords : {
		type : String,
		required : true,
	},
	// 创建时间
	created: {
	    type: Date,
	    default: Date.now
	}
},{safe:true});



//查询所有分类
PersonSchema.statics.FindAll  = function(callback){
	return this.find(null,callback);
}

//删除文章ID
PersonSchema.statics.DeletId = function(id,callback){
	return this.findByIdAndRemove(id,callback);
}

//update指定ID信息   /**可删除**/
PersonSchema.statics.UpdateId = function(id,data,callback){
	return this.findByIdAndUpdate(id,{ $set:data },callback);
}

module.exports =  mongodb.mongoose.model('tags', PersonSchema);
