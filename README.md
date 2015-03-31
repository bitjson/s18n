s18n (WIP)
==========

Smart, semantic localization for html.

### Semantic Localization

```html
<html>
  <head>
    <title>foo</title>
  </head>
  <body>
    <h1>bar</h1>
    <img alt="baz">
    <foo localize>bar</foo>
  </body>
</html>
```

```bash
$ s18n extract
```

```json
{
  "acbd18db": "foo",
  "37b51d19": "bar",
  "73feffa4": "baz"
}
```

### s18n vs i18n

### Usage

-	gulp
-	command-line

CLI
---

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

Node API
--------

```bash
$ npm install s18n
```

### Extract

```js
var s18n = require('s18n');

var html = '<title>foo</title>' +
           '<img alt="bar">' +
           '<foo localize>baz</foo>';

var locale = s18n.extract(html, {
    elements: ['title'],
    attributes: ['alt'],
    directives: ['localize'],
});

// locale =>
{
  "acbd18db": "foo",
  "37b51d19": "bar",
  "73feffa4": "baz"
}
```

### Localize

```js
var s18n = require('s18n');

var html = '<title>foo</title>' +
           '<img alt="bar">' +
           '<foo localize>baz</foo>';

var options = {
  locale: [
    'ac': {
      "acbd18db": "fóó",
      "37b51d19": "bár",
      "73feffa4": "báz"
    }
  ]
};

var content = s18n.localize(html, options);

// content =>
{
  'ac' : '<title>fóó</title><img alt="bár"><foo localize>báz</foo>'
}

```

Testing Localization
--------------------

### Map

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

Options
-------

### s18n.localize(html, options)

### s18n.extract(html, options)

### s18n.map(locale, options)
