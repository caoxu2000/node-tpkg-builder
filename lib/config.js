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
  var nodeVersion = pkg.hasOwnProperty('engines') ? pkg.engines.node : '0.10.38';


  var config = {
    project: {
      name: pkg.name,
      description: pkg.description,
      version: tpkgConfig.build.version || pkg.version,
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
      projectFiles: tpkgConfig.build.projectFiles || ['package.json', 'README.md'],
      buildOutputDir: tpkgConfig.build.buildOutputDir
    }
  };

  // check for undefined config values
  Object.keys(config).forEach(function (parentKey) {
    Object.keys(config[parentKey]).forEach(function (key) {
      if (config[parentKey][key] === undefined) {
        throw new Error('missing required config value: ' + key);
      }
    });
  });

  return config;

};


module.exports = {
  init: init
};
