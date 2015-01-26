'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var Applause = require('applause');


var createFilesFromTemplates = function (config, directories, callback) {

  async.waterfall([


    // get file names for all files in template directory
    function (readCallback) {
      fs.readdir(directories.templatesDir, readCallback);
    },


    // check for any project tpkg files to override defaults
    function (filenames, overrideCallback) {

      var overrideDir = path.join(directories.projectDir, 'tpkg');
      var updatedFilenames;

      if (fs.existsSync(overrideDir)) {

        updatedFilenames = filenames.map(function (filename) {
          if (fs.existsSync(path.join(overrideDir, filename))) {
            return path.join(overrideDir, filename);
          }
          else {
            return path.join(directories.templatesDir, filename);
          }
        });

        overrideCallback(null, updatedFilenames);

      }
      else {
        updatedFilenames = filenames.map(function (filename) {
          return path.join(directories.templatesDir, filename);
        });
        overrideCallback(null, updatedFilenames);
      }
    },


    // read template files, replace variables, and write new files to build directory
    function (filenames, writeCallback) {
      async.map(filenames, replaceAndWriteFile, writeCallback);
    }

  ], callback);


  function replaceAndWriteFile (filename, callback) {

    async.waterfall([


      function (readCallback) {
        // read file
        fs.readFile(filename, 'utf8', function (err, data) {
          if (err) return readCallback(err);

          // replace variables
          var applause = Applause.create({
            patterns: [
              { json: config }
            ]
          });
          var newFileContents = applause.replace(data);

          readCallback(null, newFileContents);
        });
      },


      function (newFileContents, writeCallback) {
        // write file to build directory
        var writeFilename = path.join(directories.buildDir, path.basename(filename));
        fs.writeFile(writeFilename, newFileContents, writeCallback);
      }


    ], callback);

  }

};


module.exports = {
  createFilesFromTemplates: createFilesFromTemplates
};
