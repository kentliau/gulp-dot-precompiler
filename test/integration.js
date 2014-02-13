var dot = require('../');
var gutil = require('gulp-util');

describe('gulp-dot-precompiler', function () {
  it('should process files with default options just as expected :)', function (done) {
    var stream = dot();

    stream.on('data', function (file) {
      file.contents.toString().should.equal('render["name"] = function anonymous(data) {\nvar out=\'\';return out;\n};');
    });
    stream.once('end', function () {
      done();
    });

    var file = new gutil.File({
      path: 'name.dot',
      cwd: './',
      base: './',
      contents: new Buffer('')
    });
    stream.write(file);
    stream.end();
  });
});
