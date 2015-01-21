/*
 * tpkg-builder
 *
 * Copyright (c) 2015 Greg Jopa
 * Licensed under the MIT license.
 * https://github.com/gregjopa/node-tpkg-builder/blob/master/LICENSE-MIT
 */

'use strict';


var path = require('path');
var shell = require('shelljs');

var replace = require('./replace');
var structure = require('./structure');


var build = function (projectDir, templatesDir, callback) {

  // set directory paths
  projectDir = projectDir ? projectDir : path.join(__dirname, '..');
  templatesDir = templatesDir ? templatesDir : path.join(__dirname, 'tpkg');

  var config = require('./config').init(projectDir);
  var buildDir = path.join(projectDir, config.build.buildOutputDir);

  structure.cleanBuildDir(buildDir);


  // replace config variables and write new tpkg files to build directory
  replace.createFilesFromTemplates(config, templatesDir, buildDir, function (err) {
    if (err) {
      return callback(err);
    }
    else {
      // setup build directory structure
      structure.setupFiles(config, projectDir, buildDir);
      // make tpkg
      structure.makeTpkg(config, buildDir);
    }

    callback(null);
  });

};


module.exports = {
  build: build
};
