'use strict';

var globby = require('globby');
var extract = require('./extract');
var fs = require('fs');
/* jshint ignore:start */
var Promise = require('pinkie-promise');
/* jshint ignore:end */
var pify = require('pify');
var s18n = require('../');

module.exports = function(patterns, options) {
  if (typeof options === 'undefined') {
    options = {};
  }

  var globbyOpts = options.globbyOpts || {};
  var finalOutputType = options.output || 'object';
  options.output = 'object';
  var fullLocale = {};

  return new Promise(function(resolve, reject) {
    globby(patterns, globbyOpts).then(function(paths) {
      var promiseFile = pify(fs.readFile);
      var files = [];
      paths.forEach(function(path) {
        files.push(promiseFile(path));
      });
      Promise.all(files)
        .then(function(contents) {
          var fileLocale = extract(String(contents), options);
          for (var hash in fileLocale) {
            fullLocale[hash] = fileLocale[hash];
          }
        }).then(function() {
          var formattedLocale = s18n.formatLocale(fullLocale, {
            output: finalOutputType
          });
          return resolve(formattedLocale);
        })
        .catch(function(err) {
          return reject(err);
        });
    });
  });

};
