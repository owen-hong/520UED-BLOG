var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;


/**
 * website验证器
 * @param  string url 需验证的url
 * @return boolean
 */
var websiteValidation = function(url) {
  // if (!url) {
  //   return true;
  // }
  var urlReg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w\- .\/?%&=]*)?/;

  return urlReg.test(url);
}


//定义数据库字段,data是定义数据库的字段属性
var PersonSchema = new Schema({
	keywords : {
		type : String,
		required : true,
	},
	links : {
		type : String,
		required : true,
		// validate: [websiteValidation, '{PATH} was incorrectly formed!']
	},
	concact : {
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



//查询所有文章
PersonSchema.statics.ArtFindAll = function(data,skip,count,fields,callback){
	var options = {
	    skip : skip,
	    limit : count,
	    sort : {
	      created : 'desc', // asc desc
	      // updated : 'desc'
	      // _id : -1
	    }
  	};

	return this.find(data,fields, options, callback);
}
//查询指定ID信息
PersonSchema.statics.ArtFindId  = function(id,callback){
	return this.find({
		_id : id
	},callback);
}

//update指定ID信息
PersonSchema.statics.ArtUpdateId = function(id,data,callback){
	return this.findByIdAndUpdate(id,{ $set:data },callback);
}

//删除文章ID
PersonSchema.statics.deletId = function(id,callback){
	return this.findByIdAndRemove(id,callback);
}



module.exports =  mongodb.mongoose.model('links', PersonSchema);





