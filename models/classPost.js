var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;


//定义数据库字段,data是定义数据库的字段属性
var PersonSchema = new Schema({
    classify: {
        type: String,
        required: true
    },
    classKey: {
        type: String,
        required: true
    },
    subClassify: [
        {
            subName: {
                type: String,
                required: true
            },
            subKey: {
                type: String,
                required: true
            }
        },
    ]
}, {
    safe: true
});


module.exports = mongodb.mongoose.model('subClass', PersonSchema);