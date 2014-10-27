
var mongoose = require('mongoose');    //引用mongoose模块
var db = mongoose.createConnection('localhost','test'); //创建一个数据库连接



// var PersonSchema;   //Person的文本属性
// var PersonModel;    //Person的数据库模型
// var PersonEntity;   //Person实体


db.on('error',console.error.bind(console,'连接错误:'));

db.once('open',function(){

  	// console.log("打开一次");
});

//定义数据库字段
var PersonSchema = new mongoose.Schema({
	name : String, //定义一个属性name，类型为String
	age : String

},{safe:true});

PersonSchema.methods.findEntity = function(cb){
	return this.model('oktest').find({

		name : this.name,
		age : this.age

	},cb);
}

//查询
PersonSchema.statics.findAge = function(age,cb){
	return this.find({
		age : new RegExp(age,'i')
	},cb);
}

//更新查询ID
PersonSchema.statics.updateId = function(id,ops,cb){
	return this.findByIdAndUpdate(id,{
		$set:{
			name: ops.name,
			age: ops.age
		}
	},cb);
}
//更新查询条件自己选择
PersonSchema.statics.updateGo = function(id,ops,cb){
	return this.update({
		_id : id
	},{
		$set:{
			name : ops.name,
			age : ops.age
		}
	},cb);
}



//将该Schema发布为Model
var PersonModel = db.model('oktest',PersonSchema);
//如果该Model已经发布，则可以直接通过名字索引到，如下：
//var PersonModel = db.model('Person');
//如果没有发布，上一段代码将会异常


//存储条件或者删除条件
var PersonEntity = new PersonModel({
	name : 'zong',
	age : '50'
});


//保存数据
// PersonEntity.save(function(){
// 	console.log('数据保存成功!');
// });



// var PersonEntity2 = db.model('oktest',PersonSchema);
// //链式查询
// PersonEntity2.find(null)
// // .where('age').lt('100').limit(2)
// .exec(function(err,person){
// 	console.log(person);
// });





//查询 
// PersonEntity2.findAge('26',function(err,persons){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		persons.forEach(function(post){
// 			console.log(post.name);
// 		});
// 	}
// });


//更新后返回对象本身
// PersonEntity2.updateId("533ccdea43d5999c28ad29f2",{
// 	name : 'hong321',
// 	age : '444'
// },function(err,person){
// 	console.log(person);
// });


//更新后回调获取更新数量
// PersonEntity2.updateGo('533d4fea6660b14426591a88',{
// 	name : 'hong321',
// 	age : '123'
// },function(err,count){
// 	console.log(count);
// });




//删除
// PersonEntity2.findByIdAndRemove('533ccd40c59adaa827a7f06f',function(err,person){
// 	console.log(person);
// });



// var ChildSchema1 = new mongoose.Schema({name:String,age:String});
// var ChildSchema2 = new mongoose.Schema({name:String,age:String});


// var ParentSchema = new mongoose.Schema({
//   	// children1:ChildSchema1,   //嵌套Document
//   	children2:[ChildSchema2]  //嵌套Documents
// });


// var ParentModel = db.model('Person',ParentSchema);
// var parent = new ParentModel({
//   	children2:[
// 	  	{name:'c1',age:'123'},
// 	  	{name:'c2',age:'456'}
//   	]
// });


// parent.children2[0].name = 'd';

// parent.save(function(){
// 	console.log("成功");
// });


var classSchema = new mongoose.Schema({
	artId : String,
	classify : {
		type: String,
		required : true
	},
	subClassify :[
		{
			test1 : String,
			test2 : String
		},
	]
},{safe:true});

var classModel = db.model('subClass',classSchema);




var parent = new classModel({
	artId : '123',
	classify: 'JS开发',
	subClassify :[
		{
			test1 : "abc",
			test2 : "bdc"
		},
	]
});


classModel.findById('534a3b589f5ea9a8030288a4',function(err,persons){

	// persons.subClassify.push({
	// 	test1 :"测试下尼玛",
	// 	test2 : "尼玛测试下"
	// });

	// console.log(persons.subClassify);

	for(var i =0;i<persons.subClassify.length;i++){
		if(persons.subClassify[i]._id=="534bdf9e3eee858c32b50dab"){
			console.log("ok");
			persons.subClassify.splice(i,1);
		}
	}

	persons.save(function(err,data){
		console.log(err);
		console.log(data);
	});

});




// parent.save(function(err,data){
// 	console.log(data);
// })

// classModel.find(null,function(err,data){
// 	console.log(data);
// });





