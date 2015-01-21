# tpkg-builder

build tool for node apps using tpkg


## Getting Started

```
$ npm install tpkg-builder
$ touch tpkg.json
$ node_modules/.bin/tpkg-builder
```

## Tpkg Config File

Add a tpkg.json file to the root directory of your project. The follow fields are required:

```javascript
{
  "account": {
    "maintainer": "maintainer@example.com",
    "runAsUser": "webuser",
    "runAsUserGroup": "rolewebusers"
  },
  "build": {
    "appFolder": "app",
    "buildOutputDir": "tpkg_build"
  }
}
```


## Programmatic Usage

You can require the `tpkg-builder` module and use the `tpkgBuilder.build()` async method
to create a tpkg.

```javascript
var tpkgBuilder = require('tpkg-builder');
var path = require('path');

var projectDir = path.join(__dirname, '..');
var templatesDir = path.join(__dirname, '../lib/tpkg');

tpkgBuilder.build(projectDir, templatesDir, function (err) {
  if (err) console.error(err);
  console.log('task complete');
});
```
