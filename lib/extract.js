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
  options.directives = options.directives || ['translate=yes'];
  // do not localize the contents of all elements with the following attributes
  options.cancelers = options.cancelers || ['translate=no'];
  options.algorithm = options.hashAlgorithm || 'md5';
  options.hashLength = options.hashLength || 8;

  var locale = {};

  var parser = new htmlparser.Parser(new htmlparser.DomHandler(function(err, dom) {
    // todo: does this callback need any sort of error handling?

    var strings = [];
    var elements = getElementsToLocalize(dom, options.elements, options.directives, options.cancelers);
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

function getElementsToLocalize(dom, elementsArray, directivesArray, cancelersArray) {

  // split directives requiring a certain value, e.g. 'translate=yes'
  var directiveDefs = [];
  for (var i = 0; i < directivesArray.length; i++) {
    directiveDefs[i] = directivesArray[i].split('=');
  }

  // split cancelers requiring a certain value, e.g. 'translate=no'
  var cancelerDefs = [];
  for (var j = 0; j < cancelersArray.length; j++) {
    cancelerDefs[j] = cancelersArray[j].split('=');
  }

  var filterDom = function(elem) {
    // each dom node must pass without being cancelled
    var passes = false;
    var cancel = false;

    // check if dom node is a matching element
    if (htmlparser.DomUtils.isTag(elem)) {
      if (elementsArray.indexOf(elem.name) !== -1) {
        passes = true;
      }
    }

    if (elem.attribs) {

      // check directives
      for (var k = 0; k < directiveDefs.length; k++) {
        if (elem.attribs.hasOwnProperty(directiveDefs[k][0])) {
          if (directiveDefs[k].length === 1) {
            // has a matching directive
            passes = true;
          } else if (elem.attribs[directiveDefs[k][0]] === directiveDefs[k][1]) {
            // has a matching directive=value combination
            passes = true;
          }
        }
      }

      // check cancelers
      for (var m = 0; m < cancelerDefs.length; m++) {
        if (elem.attribs.hasOwnProperty(cancelerDefs[m][0])) {
          if (cancelerDefs[m].length === 1) {
            // has a matching canceler
            cancel = true;
          } else if (elem.attribs[cancelerDefs[m][0]] === cancelerDefs[m][1]) {
            // has a matching canceler=value combination
            cancel = true;
          }
        }
      }
    }

    if (passes && !cancel) {
      return true;
    }
    return false;
  };

  return htmlparser.DomUtils.filter(filterDom, dom);
}
