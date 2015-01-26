'use strict';

var path = require('path');


var init = function (projectDir) {

  var pkg = require(path.join(projectDir, 'package.json'));

  var tpkgConfig;
  try {
    tpkgConfig = require(path.join(projectDir, 'tpkg.json'));
  }
  catch (err) {
    console.error('error - missing tpkg.json config file');
    process.exit(-1);
  }

  var homeDir = '/home/t/' + pkg.name;
  var nodeVersion = pkg.hasOwnProperty('engines') ? pkg.engines.node : '0.10.35';


  var config = {
    project: {
      name: pkg.name,
      description: pkg.description,
      version: pkg.version,
      nodeVersion: nodeVersion,
      startScript: homeDir + '/' + pkg.main,
    },
    directory: {
      home: homeDir,
      run: homeDir + '/run',
      log: homeDir + '/log',
      cron: homeDir + '/etc/cron.d',
      init: homeDir + '/etc/init.d',
      sysconfig: homeDir + '/etc/sysconfig',
    },
    account: {
      maintainer: tpkgConfig.account.maintainer,
      runAsUser: tpkgConfig.account.runAsUser,
      runAsUserGroup: tpkgConfig.account.runAsUserGroup
    },
    build: {
      appFolder: tpkgConfig.build.appFolder,
      buildOutputDir: tpkgConfig.build.buildOutputDir
    }
  };

  return config;

};


module.exports = {
  init: init
};
