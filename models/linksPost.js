var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;


//定义数据库字段,data是定义数据库的字段属性
var PersonSchema = new Schema({
    keywords: {
        type: String,
        required: true,
    },
    links: {
        type: String,
        required: true
    },
    concact: {
        type: String,
        required: true
    },
    // 创建时间
    created: {
        type: Date,
        default: Date.now
    }
}, {
    safe: true
});


module.exports = mongodb.mongoose.model('links', PersonSchema);