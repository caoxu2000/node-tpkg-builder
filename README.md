# tpkg-builder

The tpkg-builder node module is a build tool for deploying node apps with tpkg.
This module standardizes common tpkg setup requirements like:

* managing tpkg dependencies
* managing log files with logrotate
* assigning user account permissions
* optional support for the node config module
* optional support for newrelic


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

var projectDir = path.join(__dirname, '../..');
var templatesDir = path.join(__dirname, '../../node_modules/tpkg-builder/lib/tpkg');

tpkgBuilder.build(projectDir, templatesDir, function (err) {
  if (err) console.error(err);
  console.log('task complete');
});
```
