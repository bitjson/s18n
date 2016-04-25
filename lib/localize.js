'use strict';

var utils = require('./utils');

module.exports = function(html, options) {
  options.rewriteLangAttribute = options.rewriteLangAttribute === false ? false : true;

  if (!options.nativeLocale) {
    throw new Error('s18n: missing required option `nativeLocale`.');
  }
  if (!options.locales && !options.locale) {
    throw new Error('s18n: missing required option `locales` or `locale`.');
  }
  if (options.locales && options.locale) {
    throw new Error('s18n: both `locale` and `locales` options are defined.');
  }
  if (options.rewriteLangAttribute && !options.nativeLocaleId) {
    throw new Error('s18n: `nativeLocaleId` is required when `rewriteLangAttribute` is true.');
  }
  if (options.rewriteLangAttribute && options.locale && !options.localeId) {
    throw new Error('s18n: `localeId` is required when using the `locale` option and `rewriteLangAttribute` is true.');
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
    options.locales[options.localeId] = options.locale;
  }
  for (var id in options.locales) {
    localizations[id] = html;
    for (var i = 0; i < nativeLocale.length; i++) {
      localizations[id] = softReplace(
        localizations[id],
        nativeLocale[i].string,
        options.locales[id][nativeLocale[i].hash]);
    }

    if (options.rewriteLangAttribute) {
      var langRegex = new RegExp('<[^>]*?\\s+lang\\s*=\\s*["\']?\\s*(' + options.nativeLocaleId + ')\\s*["\']?[\\s\\S]*?>', 'ig');
      var lockLangRegex = new RegExp('<[^>]*?\\s*(s18n-lock-lang)\\s*=\\s*["\']?[\\s\\S]*?["\']?[\\s\\S]*?>', 'ig');
      for (var localeId in localizations) {
        localizations[localeId] = localizations[localeId]
          //replace lang attributes
          .replace(langRegex, langReplaceFunction(options.nativeLocaleId, localeId))
          //replace s18n-lock-lang attributes
          .replace(lockLangRegex, lockLangReplaceFunction);
      }
    }

  }
  if (options.locale) {
    localizations = localizations[options.localeId];
  }
  return localizations;
};

function langReplaceFunction(before, after) {
  return function(match) {
    return match.replace(before, after);
  };
}

function lockLangReplaceFunction(match, lockLangAttr) {
  return match.replace(lockLangAttr, 'lang');
}

// avoids unintentional localization of unrelated strings
function softReplace(contentBlock, nativeString, localizedString) {
  var escapedString = ignoreExtraSpaces(
    ignoreEmptyAttrs(
      utils.escapeRegExpSpecialChars(
        nativeString
      )
    )
  );
  var regex = new RegExp('([>"\']\\s*)(' + escapedString + ')(\\s*[<"\'])', 'g');
  return contentBlock.replace(regex, '$1' + localizedString + '$3');
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
