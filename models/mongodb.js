var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/UED');
exports.mongoose = mongoose;