# Change Log

## [1.0.2] - 2017-06-27
### Added
- Added ISC license.

### Fixed
- Fixed scroll positions set by in-page links in docs.
- Fixed script tag src typo in docs.

## [1.0.1] - 2017-06-19
### Fixed
- Fixed documentation browser compatibility issues.

## [1.0.0] - 2017-06-16
### Added
- Added `normalize` option to `mpeInstrument`.
- Added `pitch` option to `mpeInstrument`.
- Added `pitchBendRange` option to `mpeInstrument`.
- Added `clear` method to `mpeInstrument`.

### Changed
- `mpeInstrument` is now the default output of the module, rather than a named
export.
- `normalize` option is set to `true` by default – named properties are now
scaled rather than raw 14-bit integers.
- Extended documentation.

### Removed
- Removed `recorder` class.

[1.0.2]: https://github.com/WeAreRoli/mpejs/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/WeAreRoli/mpejs/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/WeAreRoli/mpejs/compare/v0.1.8...v1.0.0
