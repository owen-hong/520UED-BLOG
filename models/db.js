var config = require('../config');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db(config.db.db, new Server(config.db.host, config.db.port, {
	auto_reconnect : true
}),{safe:true});