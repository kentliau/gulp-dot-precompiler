var through = require('through2');
var dot = require('dot');
var gutil = require('gulp-util');
var _ = require('lodash');
var path = require('path');
var PluginError = gutil.PluginError;
var fs = require('fs');
var defs = {};


const PLUGIN_NAME = 'gulp-dot-precompiler';

function getTemplateName(root, name, extension, separator) {
  var parts = name.split(path.sep);
  if(root.length !== 0 )
  {
    parts.unshift(root);
  }
  if(extension.length !== 0)
  {
    parts[parts.length-1] = parts[parts.length-1] + extension;
  }
  return parts.join(separator);
}

function getTemplateCode(content,dotSetting,defs) {
  return dot.template(content,dotSetting,defs).toString();
}

function readStream(stream, done) {
  var buffer = '';
  stream.on('data', function (chunk) {
    buffer += chunk;
  }).on('end', function () {
    done(null, buffer);
  }).on('error', function (error) {
    done(error);
  });
}

function gulpDotify(options) {
  options = options || {};
  _.defaults(options, {
    root: '',
    separator: '.',
    extension: '',
    dictionary: 'render',
    //doT.js setting
    varname: 'data',
    strip:    true,
    append:   true,
    selfcontained: false
  });

  var dotSetting = {
      evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
      interpolate: /\{\{=([\s\S]+?)\}\}/g,
      encode:      /\{\{!([\s\S]+?)\}\}/g,
      use:         /\{\{#([\s\S]+?)\}\}/g,
      useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
      define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
      defineParams:/^\s*([\w$]+):([\s\S]+)/,
      conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
      iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
      varname:  options.varname,
      strip:    options.strip,
      append:   options.append,
      selfcontained: options.selfcontained
  };

  var stream = through.obj(function (file, enc, callback) {
    var complete = function (error, contents) {
      if (error) {
        throw new PluginError(PLUGIN_NAME, error);
      }

      defs.loadfile = function(include_path) {

        current_path = (file.path).substr(0, (file.path).lastIndexOf('/')+1 );
        return fs.readFileSync(current_path + include_path);
      };

      var relative_path = file.relative;
      var trimmed_ext = relative_path.substr(0, relative_path.lastIndexOf('.')) || relative_path;

      var name = getTemplateName(options.root, trimmed_ext, options.extension, options.separator);
      var code = getTemplateCode(contents,dotSetting,defs);
      file.contents = new Buffer([options.dictionary, '["', name, '"] = ', code, ';'].join(''));

      this.push(file);
      return callback();
    }.bind(this);

    if (file.isBuffer()) {
      complete(null, file.contents.toString());
    } else if (file.isStream()) {
      readStream(file.contents, complete);
    }
  });
  return stream;
};

module.exports = gulpDotify;
