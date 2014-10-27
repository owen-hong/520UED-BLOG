var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

//定义数据库字段,data是定义数据库的字段属性
var PersonSchema = new Schema({
	title : String,
	keywords : String,
	description : String,
	author : String,
	tags : {
		type : String,
		default: 'JS'
	},
	authorIcon : {
		type :String,
		default: '/images/owen.jpg'
	},
	imgUrl : String,
	classify : String,
	Content : String,
	addPraise : {
		type:String,
		default : 0
	},
	clickCount :{
		type:Number,
		default : 0
	},
	// 创建时间
	created: {
	    type: Date,
	    default: Date.now
	},
	// 更新时间
	updated: {
	    type: Date,
	    // default: Date.now
	}
});


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

//模糊查询,搜索查询
PersonSchema.statics.searchFind = function(opt,callback){
	var query={};
	query['title'] = new RegExp(opt);
	return this.find(query, callback);
}

//查询指定ID信息
PersonSchema.statics.ArtFindId  = function(id,callback){
	return this.find({
		_id : id
	},callback);
}
//查询指定分类的数据
PersonSchema.statics.Category  = function(data,callback){
	return this.find({
		classify : data
	},callback);
}


//查询一条指定ID文章
PersonSchema.statics.Findone  = function(id,callback){
	return this.findOne({
		_id : id
	},callback);
}

//查询tags
PersonSchema.statics.Tags = function(opt,callback){
	var query={};
	query['tags'] = new RegExp(opt);
	return this.find(query, callback);
}


//update指定ID信息
PersonSchema.statics.ArtUpdateId = function(id,data,callback){
	return this.findByIdAndUpdate(id,{ $set:data },callback);
}

//删除文章ID
PersonSchema.statics.deletArtId = function(id,callback){
	return this.findByIdAndRemove(id,callback);
}


module.exports = mongodb.mongoose.model('artPost', PersonSchema);