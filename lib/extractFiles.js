'use strict';

var globby = require('globby');
var extract = require('./extract');
/* jshint ignore:start */
var Promise = require('pinkie-promise');
/* jshint ignore:end */
var fs = require('fs');
var promiseFile = require('pify')(fs.readFile, Promise);
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
      var files = [];
      paths.forEach(function(path) {
        files.push(promiseFile(path, 'utf-8'));
      });
      Promise.all(files)
        .then(function(contents) {
          var fileLocale = extract(contents, options);
          for (var hash in fileLocale) {
            fullLocale[hash] = fileLocale[hash];
          }
        })
        .then(function() {
          var formattedLocale = s18n.formatLocale(fullLocale, {
            output: finalOutputType
          });
          resolve(formattedLocale);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  });

};
