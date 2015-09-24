# tpkg-builder

The tpkg-builder node module is a build tool for deploying node apps with tpkg.
This module standardizes common tpkg setup requirements like:

* managing tpkg dependencies
* managing log files with logrotate
* assigning user account permissions
* optional support for the node config module
* optional support for newrelic


## Getting Started

Use the `tpkg-builder` shell script to create a .tpkg file for your node.js project.

```
$ npm install tpkg-builder
$ touch tpkg.json
$ node_modules/.bin/tpkg-builder
```

Or use the tpkg-builder module programmatically. You can require the `tpkg-builder` module
and use the `tpkgBuilder.build()` async method to create a tpkg.

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
    "projectFiles": ["package.json", "README.md"],
    "buildOutputDir": "tpkg_build"
  }
}
```

You can optionally define the app version in the `build.version` property in the tpkg.json file.
If the version is not defined in tpkg.json then it uses the version in the package.json file.


## Config Options used from package.json

```javascript
{
  "name": "example-js",
  "description": "example node.js project",
  "version": "1.0.0",
  "main": "app/server.js",
  "engines": {
    "node": "0.10.38"
  }
}
```

The node.js version number must be exact since it's used in the tpkg.yml file to install
the node.js tpkg dependency.


## Logging

Log messages from stdout and stderr are appended to a log file. The logrotate program is used
to rotate logs and keep the last 30 log files.

```
/home/t/bin/node /home/t/example-js/app/index.js >> /home/t/example-js/log/example-js.log 2>&1 &
```


## Overriding tpkg templates

All tpkg template files like `postinstall` and `postremove` can be overridden.
To override any of these files create a new "tpkg" folder at the root of your project
directory. Copy and paste the template files you would like to alter into this new tpkg
directory. The template files are included in this module in lib/tpkg. The following
files can be overridden:

* config.sh
* crontab
* init.sh
* logrotate.conf
* postinstall
* postremove
* tpkg.yml
