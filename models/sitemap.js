var xmlbuilder = require('xmlbuilder');
var eventproxy = require('eventproxy');
var ArtPost = require('../models/artPost.js');
var mcache = require('memory-cache');
var config = require('../config');

exports.index = function (req, res, next) {
    var urlset = xmlbuilder.create('urlset', {
        version: '1.0',
        encoding: 'UTF-8'
    });
    urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    var ep = new eventproxy();
    ep.fail(next);

    ep.all('sitemap', function (sitemap) {
        res.type('xml');
        res.send(sitemap);
    });

    var sitemapData = mcache.get('sitemap');

    if (sitemapData) {
        ep.emit('sitemap', sitemapData);
    } else {

        var fields = 'title created author Content _id description';

        ArtPost.ArtFindAll(null, 0, 10000, fields, function (err, data) {
            if (err) {
                return next(err);
            }

            urlset.ele('url').ele({
                'loc': config.rss.link,
                'priority': '1',
                'lastmod': new Date().toUTCString(),
                'changefreq': 'Always'
            });

            data.forEach(function (topic) {
                urlset.ele('url').ele({
                    'loc': config.rss.link + topic._id,
                    'priority': '0.8',
                    'lastmod': topic.created.toUTCString(),
                    'changefreq': 'Always'
                });
            });

            var sitemapData = urlset.end();

            // 缓存一天
            mcache.put('sitemap', sitemapData, 1000 * 3600 * 24);
            ep.emit('sitemap', sitemapData);

        });
    }
};