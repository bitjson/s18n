'use strict';

module.exports = function(locale, options) {
  options = options || {};
  options.dictionary = options.dictionary || 'accents';

  if(typeof options.dictionary === 'string'){
    options.dictionary = dictionaries[options.dictionary];
  }

  var regexs = {};
  for (var findString in options.dictionary) {
    //don't replace characters inside html tags (between `<` and `>`)
    regexs[options.dictionary[findString]] = new RegExp('(?![^<]*>)' + escapeRegExp(findString), 'g');
  }
  for (var hash in locale) {
    for (var replacement in regexs) {
      locale[hash] = locale[hash].replace(regexs[replacement], replacement);
    }
  }
  return locale;
};

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

var dictionaries = {
  'accents': {
    'a': 'á',
    'e': 'é',
    'i': 'í',
    'o': 'ó',
    'u': 'ú'
  }
};
