var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

//定义数据库字段,data是定义数据库的字段属性
var PersonSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    // 创建时间
    created: {
        type: Date,
        default: Date.now
    },
    icon: {
        type: String,
        default: '/images/owen.jpg'
    }
}, {
    safe: true
});


module.exports = mongodb.mongoose.model('passport', PersonSchema);