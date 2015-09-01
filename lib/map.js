'use strict';

var utils = require('./utils');

module.exports = function(locale, options) {
  options = options || {};
  options.dictionary = options.dictionary || 'accents';

  if(typeof options.dictionary === 'string'){
    options.dictionary = dictionaries[options.dictionary];
  }

  var regexs = regexifyDictionary(options.dictionary);
  for (var hash in locale) {
    for (var replacement in regexs) {
      locale[hash] = locale[hash].replace(regexs[replacement], replacement);
    }
  }
  return locale;
};

function regexifyDictionary(dictionary){
  var regexs = {};
  for (var entry in dictionary) {
    //don't replace characters inside html tags (between `<` and `>`)
    regexs[dictionary[entry]] = new RegExp('(?![^<]*>)' + utils.escapeRegExpSpecialChars(entry), 'g');
  }
  return regexs;
}

var dictionaries = {
  'accents': {
    'a': 'á',
    'e': 'é',
    'i': 'í',
    'o': 'ó',
    'u': 'ú',
    'A': 'Á',
    'E': 'É',
    'I': 'Í',
    'O': 'Ó',
    'U': 'Ú'
  }
};
