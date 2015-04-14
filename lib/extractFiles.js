'use strict';

var globby = require('globby'),
  extract = require('./extract'),
  fs = require('fs'),
  async = require('async'),
  s18n = require('../');

module.exports = function(patterns, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  var globbyOpts = options.globbyOpts || {};
  var fullLocale = {};
  globby(patterns, globbyOpts, function(err, paths) {
    if (err) {
      return callback(err);
    }
    async.each(paths, function(path, cb) {
      fs.readFile(path, function(err, contents) {
        if (err) {
          cb(err);
        }
        var fileLocale = extract(String(contents), options);
        for (var hash in fileLocale) {
          fullLocale[hash] = fileLocale[hash];
        }
        cb();
      });
    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, s18n.formatLocale(fullLocale));
    });
  });
};
