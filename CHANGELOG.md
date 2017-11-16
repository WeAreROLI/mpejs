# Change Log

## [1.0.4] - 2017-11-16
### Fixed
- Fixed an error where Note On messages were misinterpreted as Control Change
messages. Thanks [@grz0zrg].
- Updated LICENSE file to match other ROLI ISC licensed projects. Thanks
[@bensupper].

## [1.0.3] - 2017-10-18
### Fixed
- Fixed error in docs usage example.

## [1.0.2] - 2017-06-27
### Added
- Added ISC license.

### Fixed
- Fixed scroll positions set by in-page links in docs.
- Fixed script tag src typo in docs. Thanks [@manifestinteractive].

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

[@grz0zrg]: https://github.com/grz0zrg
[@manifestinteractive]: https://github.com/manifestinteractive
[@bensupper]: https://github.com/bensupper

[1.0.4]: https://github.com/WeAreRoli/mpejs/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/WeAreRoli/mpejs/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/WeAreRoli/mpejs/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/WeAreRoli/mpejs/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/WeAreRoli/mpejs/compare/v0.1.8...v1.0.0
