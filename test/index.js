'use strict';

var tap = require('tap');
var path = require('path');
var fs = require('fs');
var tpkgBuilder = require('../lib/tpkg-builder');

var projectDir = path.join(__dirname, 'fixtures/example_app');
var templatesDir = path.join(__dirname, '../lib/tpkg');
var tpkgConfig = require(path.join(projectDir, 'tpkg.json'));
var buildSubDir = path.join(projectDir, tpkgConfig.build.buildOutputDir, 'build');


tap.test('tpkg build output', function (t) {
  t.plan(6);

  tpkgBuilder.build(projectDir, templatesDir, function (err) {
    if (err) {
      t.fail('tpkgBuilder.build() failed');
    }
    else {
      t.pass('tpkg folder structure built');

      var expectedBuildFiles = ['postinstall', 'postremove', 'root', 'tpkg.yml'];
      var expectedProjectFiles = ['README.md', 'app', 'etc', 'package.json'];
      var expectedCronFiles = ['example-js-logrotate.conf', 'example-js.crontab'];
      var expectedInitFiles = ['example-js-init.sh'];
      var expectedSysconfigFiles = ['example-js-config.sh'];

      var buildFiles = fs.readdirSync(buildSubDir).sort();
      t.deepEqual(buildFiles, expectedBuildFiles, 'build files match');

      var projectPath = path.join(buildSubDir, 'root/home/t/example-js');
      var projectFiles = fs.readdirSync(projectPath).sort();
      t.deepEqual(projectFiles, expectedProjectFiles, 'project files match');

      var cronPath = path.join(buildSubDir, 'root/home/t/example-js/etc/cron.d');
      var cronFiles = fs.readdirSync(cronPath).sort();
      t.deepEqual(cronFiles, expectedCronFiles, 'cron files match');

      var initPath = path.join(buildSubDir, 'root/home/t/example-js/etc/init.d');
      var initFiles = fs.readdirSync(initPath).sort();
      t.deepEqual(initFiles, expectedInitFiles, 'init.d files match');

      var sysconfigPath = path.join(buildSubDir, 'root/home/t/example-js/etc/sysconfig');
      var sysconfigFiles = fs.readdirSync(sysconfigPath).sort();
      t.deepEqual(sysconfigFiles, expectedSysconfigFiles, 'sysconfig files match');
    }
  });

});
