var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;


//定义数据库字段,data是定义数据库的字段属性
var PersonSchema = new Schema({
	arttitle : String,
	artid : String,
	icon : {
		type:String,
		default : '/images/visitor_icon.jpg'
	},
	username : {
		type: String,
		required : true,
	},
	Email : {
		type: String,
		required : true,
	},
	website : {
		type: String,
	},
	comment :{
		type: String,
		required : true,
	},
	commentTime : {
		type: Date,
		default: Date.now
	},
	reply :[
		{
			icon : String,
			author : {
				type: String,
				required : true,
			},
			contents : {
				type: String,
			},
			replyTime : {
				type: Date,
	    		default: Date.now
			}
		},
	],
});

//保存分类
PersonSchema.statics.reply = function(id,opt,callback){
	return  this.findOne({_id : id}, function(err,data){
				data.reply.push({
					icon : opt.icon,
					author : opt.author,
					contents:opt.contents,
				});

				//存储
				data.save(callback);
			});
}

PersonSchema.statics.ComFindAll = function(data,skip,count,fields,callback){
	var options = {
	    skip : skip,
	    limit : count,
	    sort : {
	      commentTime : 'asc', // asc desc
	      // updated : 'desc'
	      // _id : -1
	    }
  	};

	return this.find(data,fields, options, callback);
}
//删除分类
PersonSchema.statics.removeSub = function(id,subId,callback){
	return  this.findById(id,function(err,persons){

				for(var i =0;i<persons.subClassify.length;i++){
					if(persons.subClassify[i]._id==subId){
						persons.subClassify.splice(i,1);
					}
				}
				//存储
				persons.save(callback);
			});
}

//删除ID
PersonSchema.statics.delet = function(id,callback){
	return this.findByIdAndRemove(id,callback);
}

//查询指定ID信息
PersonSchema.statics.findId  = function(id,callback){
	return this.find({
		_id : id
	},callback);
}

module.exports = mongodb.mongoose.model('comment',PersonSchema);





