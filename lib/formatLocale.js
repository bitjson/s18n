'use strict';

// formatLocale currently depends on the javascript interpreter to preserve the
// property order of objects. Should this "de facto" standard change, this
// method can be modified to provide similar output by another means.

module.exports = function(locale, options) {
  options = options || {};
  if (typeof options.output === 'undefined') {
    options.output = 'object';
  }

  var strings = [];
  for (var hash in locale) {
    strings.push({
      hash: hash,
      string: locale[hash]
    });
  }
  // strings are ordered alphabetically for better readability & source control
  strings.sort(function(a, b) {
    if (a.string.toLowerCase() < b.string.toLowerCase()) {
      return -1;
    }
    if (a.string.toLowerCase() > b.string.toLowerCase()) {
      return 1;
    }
    return 0;
  });
  var sortedLocale = {};
  for (var i = 0; i < strings.length; i++) {
    sortedLocale[strings[i].hash] = strings[i].string;
  }
  if (options.output === 'object') {
    // depends on persistent javascript object property order
    return sortedLocale;
  }
  if (options.output === 'string') {
    // depends on persistent javascript object property order
    return JSON.stringify(sortedLocale, null, '  ');
  } else {
    throw new Error('Unrecognized `output` type');
  }
};
