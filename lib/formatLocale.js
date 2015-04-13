'use strict';

// formatLocale currently depends on the javascript interpreter to preserve the
// property order of objects. Should this "de facto" standard change, this
// method can be modified to provide similar output by another means.

module.exports = function(locale, options) {
  options = options || {};

  var strings = [];
  for (var hash in locale) {
    strings.push({
      hash: hash,
      string: locale[hash]
    });
  }
  // strings are ordered alphabetically for better readability & source control
  strings.sort(function(a, b) {
    if (a.string < b.string) {
      return -1;
    }
    if (a.string > b.string) {
      return 1;
    }
    return 0;
  });
  var sortedLocale = {};
  for (var i = 0; i < strings.length; i++) {
    sortedLocale[strings[i].hash] = strings[i].string;
  }
  // options.object depends on persistent javascript object property order
  if (!options.stringify) {
    return sortedLocale;
  }
  // this output method depends on persistent javascript object property order
  return JSON.stringify(sortedLocale, null, '  ');
};
