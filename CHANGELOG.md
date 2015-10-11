#Changelog

S18n follows [semantic versioning](http://semver.org/).

# v2.0.0
- Added `rewriteLangAttribute` option to `s18n` method. Requires `nativeLocalId` and `localId`. When using the `locales` option, `localeId` is not necessary (as locale IDs are included in the `locales` object).
- Made `extractFiles` return a callback.

## API Changes
- `s18n` method: `nativeLocalId` and `localId` are required when `rewriteLangAttribute` is true. Since `rewriteLangAttribute` defaults to `true`, these options must be provided or `rewriteLangAttribute` must be set to false.
- `extractFiles` method: now returns a promise rather than executing a callback.

# v1.1.0
- Added the `excluders` option
- Performance improvement in `extract()`
- Began using a `.jscsrc`

# v1.0.1
- Fixed bug: allow multiple dictionary entries to `s18n.map()` to a single replacement string

# v1.0.0
- Initial release
