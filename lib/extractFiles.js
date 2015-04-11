'use strict';

var globby = require('globby'),
    extract = require('./extract'),
    fs = require('fs'),
    async = require('async');

module.exports = function(patterns, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  var fullLocale = {};
  globby(patterns, function(err, paths){
    if(err) {
      callback(err);
    }
    async.each(paths, function(path, cb) {
      fs.readFile(path, function(err, contents){
        var fileLocale = extract(String(contents), options);
        for (var hash in fileLocale){
          fullLocale[hash] = fileLocale[hash];
        }
        cb();
      });
    }, function(err){
        if(err) {
          callback(err);
        }
        callback(null, fullLocale);
    });
  });
};
