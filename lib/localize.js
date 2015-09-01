'use strict';

var utils = require('./utils');

module.exports = function(html, options) {
  if (!options.nativeLocale) {
    throw new Error('s18n: missing required option `nativeLocale`.');
  }
  if (!options.locales && !options.locale) {
    throw new Error('s18n: missing required option `locale` or `locales`.');
  }
  if (options.locales && options.locale) {
    throw new Error('s18n: both `locale` and `locales` options are defined.');
  }

  // avoids unintentional localization of unrelated strings
  function softReplace(document, nativeString, localizedString) {
    var escapedString = ignoreExtraSpaces(
      ignoreEmptyAttrs(
        utils.escapeRegExpSpecialChars(
          nativeString
        )
      )
    );
    var regex = new RegExp('([>"\']\\s*)(' + escapedString + ')(\\s*[<"\'])', 'g');
    return document.replace(regex, '$1' + localizedString + '$3');
  }

  // reconcile output of htmlparser2's `toString()` with the original document
  function ignoreEmptyAttrs(string) {
    // make `=""` optional in regex
    return string.replace(/(\\\="")/g, '\(\?\:\\\=""\)\?');
  }

  // reconcile output of htmlparser2's `toString()` with the original document
  function ignoreExtraSpaces(string) {
    return string.replace(/(\s+)/g, '\\s+')
    .replace(/(<\\\/)/g, '<\/\\s*')
      .replace(/(<)/g, '<\\s*')
      .replace(/(>)/g, '\\s*>');
  }

  var nativeLocale = [];
  for (var hash in options.nativeLocale) {
    nativeLocale.push({
      hash: hash,
      string: options.nativeLocale[hash]
    });
  }
  //sort nativeLocale by length to match longest strings first
  nativeLocale.sort(function(a, b) {
    return b.string.length - a.string.length;
  });

  var localizations = {};
  if (options.locale) {
    options.locales = {};
    options.locales.tmp = options.locale;
  }
  for (var id in options.locales) {
    localizations[id] = html;
    for (var i = 0; i < nativeLocale.length; i++) {
      localizations[id] = softReplace(
        localizations[id],
        nativeLocale[i].string,
        options.locales[id][nativeLocale[i].hash]);
    }
  }
  if (options.locale) {
    localizations = localizations.tmp;
  }
  return localizations;
};
