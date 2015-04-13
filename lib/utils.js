'use strict';

var htmlparser = require('htmlparser2'),
  crypto = require('crypto');

module.exports.filterElementsByAttributes = function(dom, attributesArray) {
  var checkAttrs = function(elem) {
    if (elem.attribs) {
      for (var i = 0; i < attributesArray.length; i++) {
        var parts = attributesArray[i].split('=');
        if (elem.attribs.hasOwnProperty(parts[0])) {
          if (parts.length === 1 || (parts.length > 1 && elem.attribs[parts[0]] === parts[1])) {
            return true;
          }
        }
      }
    }
    return false;
  };
  return htmlparser.DomUtils.filter(checkAttrs, dom);
};

module.exports.extractStringsFromAttributes = function(dom, attributesArray) {
  var strings = [];
  var elements = exports.filterElementsByAttributes(dom, attributesArray);
  for (var i = 0; i < elements.length; i++) {
    for (var j = 0; j < attributesArray.length; j++) {
      if (elements[i].attribs.hasOwnProperty(attributesArray[j])) {
        strings.push(elements[i].attribs[attributesArray[j]]);
      }
    }
  }
  return strings;
};

module.exports.hash = function(str, algorithm, length) {
  return crypto.createHash(algorithm).update(str).digest('hex').slice(0, length);
};
