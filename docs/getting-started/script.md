### Setup as a script tag

From a temporary directory, run:
```
npm install web-midi-utils
```
Take either the `node_modules/web-midi-utils/lib/WebMidiUtils.js` file or the `node_modules/web-midi-utils/lib/WebMidiUtils.min.js` and copy it to your
project.

```html
<script src="path/to/WebMidiUtils.min.js" charset="utf-8"></script>
<script>
  var mpeInstrument = new WebMidiUtils.MpeInstrument();
</script>
```

*Note*: It is recommended to use this method only for prototyping purposes.
Using the library as an npm dependency, then importing modules using the
[ES2015 module system](es2015.md) or [CommonJS](umd.md) is preferable for
larger projects.
