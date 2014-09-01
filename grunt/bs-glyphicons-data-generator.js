/*!
 * Bootstrap Grunt task for Glyphicons data generation
 * http://getbootstrap.com
 * Copyright 2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
'use strict';
var fs = require('fs');

module.exports = function generateGlyphiconsData(grunt) {
  // Pass encoding, utf8, so `readFileSync` will return a string instead of a
  // buffer
  var glyphiconsFile = fs.readFileSync('../fenixedu-canvas/assets/stylesheets/bootstrap/_fenixedu-icons.scss', 'utf8');
  var glyphiconsLines = glyphiconsFile.split('\n');

  // Use any line that starts with ".glyphicon-" and capture the class name
  var iconClassName = /^\.(glyphicon-[^\s]+)/;
  var fenixIconClassName = /^\.(icon-[^\s,]+)/;

  var bothIconClassName = /^\.(icon-[^\s,]+),\s\.(glyphicon-[^\s]+)/;

  var glyphiconsData = '# This file is generated via Grunt task. **Do not edit directly.**\n' +
                       '# See the \'build-glyphicons-data\' task in Gruntfile.js.\n\n';
  var glyphiconsYml = 'docs/_data/glyphicons.yml';

  var icons = {};

  for (var i = 0, len = glyphiconsLines.length; i < len; i++) {
    var line = glyphiconsLines[i];

    var match = line.match(bothIconClassName);

    if (match !== null) {
      var fenixIcon = match[1];
      var glyphIcon = match[2];

      icons[glyphIcon] = fenixIcon;

      //glyphiconsData += '- glyphicon: ' + glyphIcon + '\n';
      //glyphiconsData += '  icon: ' + fenixIcon + '\n';
    
    } else {
      match = glyphiconsLines[i].match(fenixIconClassName);
      if (match !== null) {
        //glyphiconsData += '- icon: ' + match[1] + '\n';
        var icon = match[1];
        icons[icon] = 1;
      } else {
        match = glyphiconsLines[i].match(iconClassName);
        if (match !== null) {
          icons[match[1]] = 1;
          //glyphiconsData += '- glyphicon: ' + match[1] + '\n';
        }
      }
    }
  }

  for (var mainIcon in icons) {
    var value = icons[mainIcon];
    if (mainIcon[0] === 'i') {
      glyphiconsData += '- icon: ' + mainIcon + '\n';
    } else {
      glyphiconsData += '- glyphicon: ' + mainIcon + '\n';
    }

    if (value !== 1){
      glyphiconsData += '  icon: ' + value + '\n';
    }
  }

  //grunt.log.writeln(JSON.stringify(icons));

  // Create the `_data` directory if it doesn't already exist
  if (!fs.existsSync('docs/_data')) {
    fs.mkdirSync('docs/_data');
  }

  try {
    fs.writeFileSync(glyphiconsYml, glyphiconsData);
  }
  catch (err) {
    grunt.fail.warn(err);
  }
  grunt.log.writeln('File ' + glyphiconsYml.cyan + ' created.');
};
