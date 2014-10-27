var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;


//定义数据库字段,data是定义数据库的字段属性
var PersonSchema = new Schema({
	classify : {
		type: String,
		required : true
	},
	classKey : {
		type: String,
		required : true
	},
	subClassify :[
		{
			subName : {
				type: String,
				required : true
			},
			subKey : {
				type: String,
				required : true
			}
		},
	]
},{safe:true});

//保存分类
PersonSchema.statics.classSave = function(id,sub,subkey,callback){
	return  this.findById(id,function(err,persons){

				persons.subClassify.push({
					subName : sub,
					subKey : subkey
				});
				//存储
				persons.save(callback);
			});
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

//查询指定ID信息
PersonSchema.statics.ArtFindId  = function(id,callback){
	return this.find({
		_id : id
	},callback);
}

//删除ID
PersonSchema.statics.deletClass = function(id,callback){
	return this.findByIdAndRemove(id,callback);
}

//update指定ID信息
PersonSchema.statics.UpdateId = function(id,data,callback){
	return this.findByIdAndUpdate(id,{ $set:data },callback);
}

//查询所有分类
PersonSchema.statics.classFindAll  = function(callback){
	return this.find(null,callback);
}


module.exports = mongodb.mongoose.model('subClass',PersonSchema);





