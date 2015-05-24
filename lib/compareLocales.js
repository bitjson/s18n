'use strict';

module.exports = function(localeA, localeB, options) {
  options = options || {};
  if (typeof localeA !== 'object' || typeof localeB !== 'object') {
    throw new Error('s18n: `localeA` and `localeB` must be objects.');
  }

  var localeAMissing = {};
  var localeBMissing = {};
  var unmodifiedStrings = {};
  var modifiedStrings = [];

  for (var hashA in localeA) {
    if (typeof localeB[hashA] === 'undefined') {
      localeBMissing[hashA] = localeA[hashA];
    } else {
      if (localeA[hashA] === localeB[hashA]) {
        unmodifiedStrings[hashA] = localeA[hashA];
      } else {
        modifiedStrings.push({
          hash: hashA,
          strings: [
            localeA[hashA],
            localeB[hashA]
          ]
        });
      }
    }
  }

  for (var hashB in localeB) {
    if (typeof localeA[hashB] === 'undefined') {
      localeAMissing[hashB] = localeB[hashB];
    }
  }

  return [
    arrayifyResults(localeAMissing),
    arrayifyResults(localeBMissing),
    arrayifyResults(unmodifiedStrings),
    modifiedStrings
  ];
};

function arrayifyResults(resultsObj) {
  var array = [];
  for (var hash in resultsObj) {
    array.push({
      hash: hash,
      string: resultsObj[hash]
    });
  }
  return array;
}
