var config = require('../config');
var convert = require('data2xml')();
var ArtPost = require('../models/artPost.js');

//缓存设置
var rssCache;
setInterval(function() {
  rssCache = null;
}, 1000 * 60 * 0.1); // 五分钟清理一次

exports.index = function (req, res, next) {

    if (!config.rss) {
        res.statusCode = 404;
        return res.send('Please set `rss` in config.js');
    }

    //声明输出类型为xml
    res.contentType('application/xml');

    if (!config.debug && rssCache) {
        res.send(rssCache);
    }else{

        var fields = 'title created author Content _id description',
            maxItem = config.rss.max_rss_items;

        ArtPost.ArtFindAll(null,0,maxItem,fields,function(err,data){

            if (err) {
                return next(err);
            }

            var rss_obj = {
                _attr: { version: '2.0' },
                channel: {
                    title: config.rss.title,
                    link: config.rss.link,
                    language: config.rss.language,
                    description: config.rss.description,
                    item: []
                },
            };

            data.forEach(function(topic){
                rss_obj.channel.item.push({
                    title: topic.title,
                    link: config.rss.link + '/article/' + topic._id,
                    guid: config.rss.link + '/article/' + topic._id,
                    description: topic.description,
                    author: topic.author,
                    pubDate: topic.created.toUTCString()
                });
            });

            var rss_content = convert('rss', rss_obj);
            rssCache = rss_content;
            res.send(rss_content);
        });
    }

}

