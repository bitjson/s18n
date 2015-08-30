'use strict';

var htmlparser = require('htmlparser2'),
  crypto = require('crypto'),
  s18n = require('../');

module.exports = function(html, options) {
  options = options || {};
  // localize the contents of all of the following elements
  options.elements = arrayify(options.elements) || ['title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'a', 'button'];
  // localize the contents of all of the following attributes
  options.attributes = arrayify(options.attributes) || ['alt', 'title'];
  // localize the contents of all elements with the following attributes
  options.directives = arrayify(options.directives) || ['s18n', 'translate=yes'];
  // do not localize the contents of all elements with the following attributes
  options.cancelers = arrayify(options.cancelers) || ['cancel-s18n', 'translate=no'];
  // localize the contents of attributes provided to this attribute
  options.attributeSetter = options.attributeSetter || 's18n-attrs';
  // do not localize the contents of attributes provided to this attribute
  options.attributeCanceler = options.attributeCanceler || 'cancel-s18n-attrs';
  options.algorithm = options.hashAlgorithm || 'md5';
  options.hashLength = options.hashLength || 8;
  options.trimWhitespace = options.trimWhitespace === false ? false : true;
  options.output = options.output || 'object';

  var locale = {};

  var parser = new htmlparser.Parser(new htmlparser.DomHandler(function(err, dom) {
    // TODO: does this callback need any sort of error handling?

    var elementStrings = getElementsContentsToLocalize(
      dom,
      options.elements,
      options.directives,
      options.cancelers
    );

    var attributeStrings = getAttributeContentsToLocalize(
      dom,
      options.attributes,
      options.attributeSetter,
      options.attributeCanceler
    );

    var strings = elementStrings.concat(attributeStrings);
    for (var j = 0; j < strings.length; j++) {
      if (options.trimWhitespace) {
        strings[j] = strings[j].trim();
      }
      if (strings[j] !== '') {
        locale[hash(strings[j], options.algorithm, options.hashLength)] = strings[j];
      }
    }
  }, {
    normalizeWhitespace: false
  }));

  parser.write(html);
  parser.done();

  return s18n.formatLocale(locale, {
    output: options.output
  });
};

function getElementsContentsToLocalize(dom, elementsArray, directivesArray, cancelersArray) {

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

  var elements = htmlparser.DomUtils.filter(filterDom, dom);
  var strings = [];
  for (var n = 0; n < elements.length; n++) {
    strings.push(htmlparser.DomUtils.getInnerHTML(elements[n]));
  }

  return strings;
}

function getAttributeContentsToLocalize(dom, attributesArray, attributeSetter, attributeCanceler) {

  var strings = [];

  var filterAttributes = function(elem) {
    if (elem.attribs) {
      var tempAttrsArray = attributesArray;
      if (elem.attribs.hasOwnProperty(attributeSetter)) {
        tempAttrsArray = tempAttrsArray.concat(elem.attribs[attributeSetter].split(' '));
      }

      // remove cancelled attributes
      if (elem.attribs.hasOwnProperty(attributeCanceler)) {
        var tempCancArray = elem.attribs[attributeCanceler].split(' ');
        for (var i = 0; i < tempCancArray.length; i++) {
          var index = tempAttrsArray.indexOf(tempCancArray[i]);
          if (index > -1) {
            tempAttrsArray.splice(index, 1);
          }
        }
      }

      for (var attr in elem.attribs) {
        if (tempAttrsArray.indexOf(attr) > -1) {
          strings.push(elem.attribs[attr]);
        }
      }

    }
    return false;
  };

  htmlparser.DomUtils.filter(filterAttributes, dom);
  return strings;
}


function arrayify(unknown) {
  if (typeof unknown === 'string') {
    return [unknown];
  }
  return unknown;
}

function hash(str, algorithm, length) {
  return crypto.createHash(algorithm).update(str).digest('hex').slice(0, length);
}
