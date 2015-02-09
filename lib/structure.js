'use strict';

var path = require('path');
var shell = require('shelljs');


var setupFiles = function (config, directories) {

  var buildSubDir = path.join(directories.buildDir, 'build');
  var homeDir = path.join(buildSubDir, 'root', config.directory.home);
  var appDir = path.join(homeDir, config.build.appFolder);
  var cronDir = path.join(buildSubDir, 'root', config.directory.cron);
  var initDir = path.join(buildSubDir, 'root', config.directory.init);
  var sysconfigDir = path.join(buildSubDir, 'root', config.directory.sysconfig);


  // setup build location
  shell.mkdir('-p', appDir);
  shell.mkdir('-p', cronDir);
  shell.mkdir('-p', initDir);
  shell.mkdir('-p', sysconfigDir);


  // copy node app files to build location
  shell.cp('-r', path.join(directories.projectDir, config.build.appFolder, '*'), appDir);
  shell.cp(path.join(directories.projectDir, 'package.json'), homeDir);
  shell.cp(path.join(directories.projectDir, 'README.md'), homeDir);

  if (shell.test('-d', path.join(directories.projectDir, 'config'))) {
    shell.mkdir('-p', path.join(homeDir, 'config'));
    shell.cp('-r', path.join(directories.projectDir, 'config/*'), path.join(homeDir, 'config'));
  }

  if (shell.test('-f', './newrelic.js')) {
    shell.cp(path.join(directories.projectDir, 'newrelic.js'), homeDir);
  }


  // move tpkg files to build location
  shell.mv(path.join(directories.buildDir, 'tpkg.yml'), path.join(buildSubDir, 'tpkg.yml'));
  shell.mv(path.join(directories.buildDir, 'postinstall'), path.join(buildSubDir, 'postinstall'));
  shell.mv(path.join(directories.buildDir, 'postremove'), path.join(buildSubDir, 'postremove'));
  shell.mv(path.join(directories.buildDir, 'crontab'),
    path.join(cronDir, config.project.name + '.crontab'));
  shell.mv(path.join(directories.buildDir, 'logrotate.conf'),
    path.join(cronDir, config.project.name + '-logrotate.conf'));
  shell.mv(path.join(directories.buildDir, 'init.sh'),
    path.join(initDir, config.project.name + '-init.sh'));
  shell.mv(path.join(directories.buildDir, 'config.sh'),
    path.join(sysconfigDir, config.project.name + '-config.sh'));


  // add execute permissions to tpkg files
  shell.chmod('-R', 755, buildSubDir);

  console.log('success - tpkg build directory setup complete')

};


var makeTpkg = function (config, buildDir) {
  var tpkgBuildDir = path.join(buildDir, 'build');
  var output = shell.exec('tpkg --make ' + tpkgBuildDir).output;

  if (output.indexOf('tpkg: command not found') !== -1) {
    console.error('error - unable to create tpkg file because the tpkg client is not installed');
    return false;
  }

  var expectedFile = path.join(buildDir, config.project.name + '-' +
    config.project.version + '-1.tpkg');

  if (!shell.test('-f', expectedFile)) {
    console.error('error - failed to create the expected tpkg file');
    return false;
  }

  return true;
};


var cleanBuildDir = function (buildDir) {
  shell.rm('-rf', buildDir);
  shell.mkdir('-p', buildDir);
};


module.exports = {
  setupFiles: setupFiles,
  makeTpkg: makeTpkg,
  cleanBuildDir: cleanBuildDir
};
