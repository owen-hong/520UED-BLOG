var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

//定义数据库字段,data是定义数据库的字段属性
var PersonSchema = new Schema({
    title: String,
    keywords: String,
    description: String,
    author: String,
    tags: {
        type: String,
		default: ''
    },
    authorIcon: {
        type: String,
        default: '/images/owen.jpg'
    },
    userId: {
        type: String,
        default: '5369a96bf916f8701fbd7cb1'
    },
    imgUrl: String,
    classify: String,
    Content: String,
    addPraise: {
        type: String,
        default: 0
    },
    clickCount: {
        type: Number,
        default: 0
    },
    // 创建时间
    created: {
        type: Date,
        default: Date.now
    },
    // 更新时间
    updated: {
        type: Date,
        default: Date.now
    }
}, {
    safe: true
});


module.exports = mongodb.mongoose.model('artPost', PersonSchema);