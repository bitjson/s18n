'use strict';

var htmlparser = require('htmlparser2'),
  utils = require('./utils.js'),
  s18n = require('../');

module.exports = function(html, options) {
  options = options || {};
  // localize the contents of all of the following elements
  options.elements = options.elements || ['title', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  // localize the contents of all of the following attributes
  options.attributes = options.attributes || ['alt', 'title'];
  // localize the contents of all elements with the following attributes
  options.directives = options.directives || ['localize'];
  options.algorithm = options.hashAlgorithm || 'md5';
  options.hashLength = options.hashLength || 8;

  var locale = {};

  var parser = new htmlparser.Parser(new htmlparser.DomHandler(function(err, dom) {
    // todo: does this callback need any sort of error handling?

    var strings = [];

    // extract strings from options.elements and elements with options.directives
    var elements = utils.filterElementsByTagNames(dom, options.elements);
    elements = elements.concat(utils.filterElementsByAttributes(dom, options.directives));
    for (var i = 0; i < elements.length; i++) {
      strings.push(htmlparser.DomUtils.getInnerHTML(elements[i]));
    }

    // extract strings from options.attributes
    strings = strings.concat(utils.extractStringsFromAttributes(dom, options.attributes));

    for (var j = 0; j < strings.length; j++) {
      locale[utils.hash(strings[j], options.algorithm, options.hashLength)] = strings[j];
    }
  }, {
    normalizeWhitespace: true
  }));

  parser.write(html);
  parser.done();

  return s18n.formatLocale(locale, {
    object: true
  });
};
