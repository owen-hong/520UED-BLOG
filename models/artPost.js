var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

//�������ݿ��ֶ�,data�Ƕ������ݿ���ֶ�����
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
	// ����ʱ��
	created: {
	    type: Date,
	    default: Date.now
	},
	// ����ʱ��
	updated: {
	    type: Date,
	    // default: Date.now
	}
});


//��ѯ��������
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

//ģ����ѯ,������ѯ
PersonSchema.statics.searchFind = function(opt,callback){
	var query={};
	query['title'] = new RegExp(opt);
	return this.find(query, callback);
}

//��ѯָ��ID��Ϣ
PersonSchema.statics.ArtFindId  = function(id,callback){
	return this.find({
		_id : id
	},callback);
}
//��ѯָ�����������
PersonSchema.statics.Category  = function(data,callback){
	return this.find({
		classify : data
	},callback);
}


//��ѯһ��ָ��ID����
PersonSchema.statics.Findone  = function(id,callback){
	return this.findOne({
		_id : id
	},callback);
}

//��ѯtags
PersonSchema.statics.Tags = function(opt,callback){
	var query={};
	query['tags'] = new RegExp(opt);
	return this.find(query, callback);
}


//updateָ��ID��Ϣ
PersonSchema.statics.ArtUpdateId = function(id,data,callback){
	return this.findByIdAndUpdate(id,{ $set:data },callback);
}

//ɾ������ID
PersonSchema.statics.deletArtId = function(id,callback){
	return this.findByIdAndRemove(id,callback);
}


module.exports = mongodb.mongoose.model('artPost', PersonSchema);