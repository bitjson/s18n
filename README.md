# s18n

Smart, semantic localization for html.

### i18n vs s18n

## Install

```bash
$ npm install s18n
```

## API

### Extract

```js
var s18n = require('s18n');

var html = '<title>foo</title>' +
           '<h1>bar</h1>' +
           '<img alt="baz">' +
           '<span localize>foobar</span>';

var options = {
    attributes: ['alt'],
    directives: ['localize'],
    elements: ['title', 'h1']
  };

var locale = s18n.extract(html, options);

// locale =>
{
  "acbd18db": "foo",
  "37b51d19": "bar",
  "73feffa4": "baz",
  "3858f622": "foobar"
}
```

### Localize

```js
var s18n = require('s18n');

var html = '<title>foo</title>' +
           '<h1>bar</h1>' +
           '<img alt="baz">' +
           '<span localize>foobar</span>';

var locale = {
  "acbd18db": "fóó",
  "37b51d19": "bár",
  "73feffa4": "báz",
  "3858f622": "fóóbár"
}

var content = s18n.localize(html, options);

// content =>
  '<title>fóó</title>' +
  '<h1>bár</h1>' +
  '<img alt="báz">' +
  '<span localize>fóóbár</span>';

```

### Map

```js
var s18n = require('s18n');

var dict = {
  'a': 'á',
  'o': 'ó'
}

var locale = {
  "acbd18db": "foo",
  "37b51d19": "bar"
}

var test = s18n.map(locale, {dictionary: dict});

// test =>
{
  "acbd18db": "fóó",
  "37b51d19": "bár"
}

```

## CLI

To access the CLI system-wide, s18n can be installed globally:

```bash
$ npm install -g s18n
```

For CLI usage information:

```bash
$ s18n --help
$ s18n extract --help
$ s18n map --help
```
