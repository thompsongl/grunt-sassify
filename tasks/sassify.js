var fs = require('fs');

var cssscss = require('css-scss');
var postcss = require('postcss');
var inline = require('postcss-import');

/**
 * Grunt plugin for css-scss
 *
 * @param  {Object} grunt
 */

module.exports = function(grunt) {
  grunt.registerTask('sassify', 'Sassy', function() {
    var options = this.options({
      regex: '',
      prefix: '',
      dest: './scss/'
    });

    var dependencies = require('../package.json').dependencies;
    var modules = [];
    for (var key in dependencies) {
      var component = key.match(options.regex);
      if (component) {
        modules.push(key);
      }
    }

    modules.forEach(function(m) {
      var cssString = '@import "' + m + '";';
      var imported = postcss()
                    .use(inline())
                    .process(cssString);
      var result = cssscss(imported);
      var filename = m.replace(options.prefix, '') + '.scss';
      filename = '_' + filename;
      grunt.file.write(options.dest + filename, result);
    });
  });
};
