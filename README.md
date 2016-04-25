[![npm version](https://badge.fury.io/js/s18n.svg)](https://www.npmjs.com/package/s18n) [![Build Status](https://travis-ci.org/bitjson/s18n.svg)](https://travis-ci.org/bitjson/s18n) [![Coverage Status](https://coveralls.io/repos/bitjson/s18n/badge.svg)](https://coveralls.io/r/bitjson/s18n) [![Dependency Status](https://david-dm.org/bitjson/s18n.svg)](https://david-dm.org/bitjson/s18n)

# Semantic Localization – s18n
S18n parses the content of html elements and attributes to extract text for translation. The automatically generated locale file can then be translated into multiple languages and used by s18n to localize the website or application.

This can be particularly powerful for static-generated sites and applications. Gulp users interested in this use-case should see [**gulp-l10n**](https://github.com/bitjson/gulp-l10n), which wraps s18n.

## s18n vs. i18n
S18n provides a simpler, automated alternative to traditional `i18n` (internationalization) libraries, in that it doesn't require outfitting application templates and content with underscore (`_()`) and other i18n functions.

## Example
This example uses the s18n CLI. Given the following `original.html` file:

```html
<h1>foo</h1>
<img alt="bar">
<foo s18n>baz</foo>
```

Using the CLI's extract command in the same directory (with default element, attribute, and directive options):

```bash
$ s18n extract > 'en.json'
```

The following `locale` is saved to `en.json`:

```json
{
  "37b51d19": "bar",
  "73feffa4": "baz",
  "acbd18db": "foo"
}
```

This locale can be translated – or for testing, s18n mapped to a simulated locale:

```bash
$ s18n map 'en.json' > 'fr.json'
```

Producing `fr.json`:

```json
{
  "37b51d19": "bár",
  "73feffa4": "báz",
  "acbd18db": "fóó"
}
```

This can then be used to test localization for the original file:

```bash
$ s18n 'original.html' -l 'fr.json' > 'translated.html'
```

```html
<h1>fóó</h1>
<img alt="bár">
<foo s18n>báz</foo>
```

# Command-Line Interface
**Please note**: some CLI options are not yet implemented for the `map` command. Pull requests welcome!

To access the CLI system-wide, s18n can be installed globally using [npm](https://docs.npmjs.com/getting-started/installing-node):

```bash
$ npm install -g s18n
```

For CLI usage information:

```bash
$ s18n
$ s18n extract --help
$ s18n localize --help
$ s18n map --help
```

CLI tests are not currently included in test coverage.

# Node API

```bash
$ npm install s18n
```

## Extracting the Native Locale
S18n parses html content and extracts strings from selected html elements and attributes. A hash of each string is used to identify it, and all hash-string pairs are stored in a `locale` object.

### s18n.extract(html, [extract options])
The `extract` method accepts a string of html and (optionally) an `extract options` object. It returns a locale object.

```js
var s18n = require('s18n');

var html = '<title>foo</title>' +
           '<img alt="bar">' +
           '<foo s18n>baz</foo>';

var locale = s18n.extract(html);
```

The `locale` object:

```json
{
  "acbd18db": "foo",
  "37b51d19": "bar",
  "73feffa4": "baz"
}
```

### s18n.extractFiles(glob, [extract options]).then(function(locale))
The `extractFiles` method is asynchronous and accepts a [globby](https://github.com/sindresorhus/globby) glob and an `extract options` object (optional) and returns a promise. The method asynchronously extracts localizations from each file selected by the glob and combines them into a single `locale` object.

```js
var s18n = require('s18n');

var htmlFiles = 'src/**/*.html';

var locale = s18n.extractFiles(htmlFiles)
  .then(function(nativeLocale){
    myApp.doSomething(nativeLocale);
   })
  .catch(function(err){
    log.error(err);
  });
```

### Extract Options
S18n's default extraction options will be ideal for most sites and applications, but advanced customization is possible.

#### elements
- Accepts: _String_, _Array of Strings_
- Default: `['title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'a', 'button']`

S18n will extract the full contents of all selected elements.

#### attributes
- Accepts: _String_, _Array of Strings_
- Default: `['alt', 'title']`

S18n will extract the full contents of all selected attributes.

#### directives
- Accepts: _String_, _Array of Strings_
- Default: `['s18n', 'translate=yes']`

S18n will extract the full contents of all elements with the following attributes. To localize only elements with an attribute set to a certain value, use an `=` character between the directive and the necessary value.

By default, the [W3C standard `translate=yes` attribute](http://www.w3.org/TR/2013/CR-html5-20130806/dom.html#attr-translate) is honored.

#### cancelers
- Accepts: _String_, _Array of Strings_
- Default: `'cancel-s18n'`

S18n will not extract the contents of any elements with the following attributes. To cancel localization of elements with an attribute set to a certain value, use an `=` character between the directive and the necessary value.

Cancelers take precedence over any setters/selectors.

#### excluders
- Accepts: _String_, _Array of Strings_
- Default: `['s18n-exclude', 'translate=no']`

S18n will completely ignore any elements with the following attributes, canceling localization of all sub-elements. To exclude localization of elements with an attribute set to a certain value, use an `=` character between the directive and the necessary value.

By default, the [W3C standard `translate=no` attribute](http://www.w3.org/TR/2013/CR-html5-20130806/dom.html#attr-translate) is honored.

#### attributeSetter
- Accepts: _String_
- Default: `'s18n-attrs'`

S18n will extract the full contents of all attributes provided in the `attributeSetter` attribute.

```html
<meta name="description" content="Friendly description." s18n-attrs="content">
<img src="img/en/1.png" title="test" alt="test2" s18n-attrs="src title alt">
```

#### attributeCanceler
- Accepts: _String_
- Default: `'cancel-s18n-attrs'`

S18n will not extract the contents of any attributes provided in the `attributeCanceler` attribute.

Attribute cancels take precedence over any attribute setters/selectors.

```html
<img src="img/2.png" title="words" alt="words2" cancel-s18n-attrs="title alt">
```

#### hashAlgorithm
- Accepts: _Algorithm name – String_
- Default: `'md5'`

S18n will use this algorithm to take the hash of each string. `hashAlgorithm` accepts any algorithm supported by [Node's `crypto.createHash()`](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm) method.

#### hashLength
- Accepts: _Positive integer – Number_
- Default: `8`

S18n will truncate hashes to this length when indexing strings in the `locale` object.

#### trimWhitespace
- Accepts: `true` or `false`
- Default: `true`

S18n will trim whitespace from each string (using javascript's `String.prototype.trim()`) if this option is set to `true`. This ensures matching phrases aren't treated as unique strings due to surrounding whitespace.

#### output
- Accepts: `object` or `string`
- Default: `object`

Based on this option, the `extract` method returns the extracted locale as a javascript object or as a formatted JSON string.

## Localize
To localize html, s18n searches through the html for strings in the `nativeLocale`, replacing them with the localized strings in each locale. S18n only matches strings in locations from which they could have been extracted (between `""`, `''`, and `><`) to avoid translating unintended strings.

### s18n(html, [options])
The s18n method accepts an html string, a `nativeLocale`, and a `locales` object of translated `locale` objects.

### Localize Settings
Both the `nativeLocale` and `locale` (or `locales`) settings are required.

#### nativeLocale
- Accepts: _locale object_
- Required

The `nativeLocale` is the `locale` object returned by the `extract()` or `extractFiles()` methods. The `s18n()` method searches the html for strings in the `nativeLocale`, and replaces them with translated strings from the `locale` or `locales` setting.

#### locale _or_ locales
- Accepts: _locale Object_ or _locales Object_
- Required

The `s18n()` method requires either the `locale` or `locales` setting.

##### locale
The `locale` setting accepts a single, translated `locale` object. When the `locale` settings is used, `s18n()` returns a single localized html string. When `rewriteLangAttribute` is true (default), both `nativeLocalId` and `localeId` must be set.

```js
var s18n = require('s18n');
var html = '<html lang="en"><title>foo</title><img alt="bar"><foo s18n>baz</foo></html>';
var settings = {
  nativeLocale: s18n.extract(html),
  nativeLocalId: 'en',
  locale: {
    "acbd18db": "fóó",
    "37b51d19": "bár",
    "73feffa4": "báz"
  },
  localeId: 'accents'
};

var content = s18n(html, settings);
```

The `content` object:

```js
'<html lang="accents"><title>fóó</title><img alt="bár"><foo s18n>báz</foo></html>'
```

##### locales
The `locales` settings accepts a `locales` object. The `locales` object keys are locale ids, and the values are their respective `locale` objects. When the `locales` settings is used, `s18n()` returns an object with locale id keys mapped to translated html strings.

```js
var s18n = require('s18n');
var html = '<html lang="en"><title>foo</title><img alt="bar"><foo s18n>baz</foo></html>';
var settings = {
  nativeLocale: s18n.extract(html),
  nativeLocalId: 'en',
  locales: {
    'ac': { "acbd18db": "fóó", "37b51d19": "bár", "73feffa4": "báz" }
    'a2': { "acbd18db": "fó2", "37b51d19": "bá2", "73feffa4": "bá2" }
  }
};

var content = s18n(html, settings);
```

The `content` object:

```js
{
  'ac': '<html lang="ac"><title>fóó</title><img alt="bár"><foo s18n>báz</foo></html>'
  'a2': '<html lang="a2"><title>fó2</title><img alt="bá2"><foo s18n>bá2</foo></html>'
}
```

#### rewriteLangAttribute
- Accepts: _Boolean_
- Default: `true`

When `rewriteLangAttribute` is true, the `s18n` method will replace `nativelLocaleId` with `localeId` in all html `lang` attributes. To make `s18n` output a `lang` attribute with the `nativelLocaleId` value, use the `s18n-lock-lang` attribute in the native html.

```html
<html lang="en">English speakers often use the word <code s18n-lock-lang="en">do</code>.</html>
<html lang="de">Englisch-Lautsprecher verwenden oft das Wort <code lang="en">do</code>.</html>
```

#### nativeLocaleId
- Accepts: _String_
- Required when `locale` is used and `rewriteLangAttribute` is true

The language code of the native document.

#### localeId
- Accepts: _String_
- Required when `locale` is used and `rewriteLangAttribute` is true

The language code of the locale being used to localize the document.

## Testing Localization
### Map
### s18n.map(locale, options)

```js
var s18n = require('s18n');

var locale = {
  "acbd18db": "foo",
  "37b51d19": "bar"
}

var test = s18n.map(locale, { dictionary: 'accents' });

// test =>
{
  "acbd18db": "fóó",
  "37b51d19": "bár"
}
```

## Utilities
### s18n.compareLocales(localeA, localeB, [options])
### s18n.formatLocale(locale, [options])
#### options
##### output *(string)*
Options: `string`, `object`

Default: `object`

# Contributing
The default Gulp task watches all files and runs tests and code coverage.

```bash
$ npm install -g gulp
$ gulp
```

## Testing
This module strives to maintain passing tests with 100% coverage in every commit, and tests are run pre-commit. If you prefer, you can always skip this check with `git commit --no-verify` and squash WIP commits for pull requests later.

If you're unsure or would like help writing tests or getting to 100% coverage, please don't hesitate to open up a pull request so others can help!

## Thanks
Thanks to [Stephen Pair](https://github.com/gasteve) of [bitpay/translations](https://github.com/bitpay/translations) for some of the architectural inspiration behind s18n. This module builds on the idea of using truncated hashes as identifiers for translatable strings, rather than manually developed indexes.
