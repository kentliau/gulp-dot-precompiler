# gulp-doT

[Gulp](https://github.com/gulpjs/gulp) plugin for precompilation of [doT](https://github.com/olado/doT) templates. Forked from [titarenko/gulp-dotify](https://github.com/titarenko/gulp-dotify) but with more control and much more logical.

## Status

[![Build Status](https://secure.travis-ci.org/kentliau/gulp-doT.png?branch=master)](https://travis-ci.org/kentliau/gulp-doT)
[![NPM version](https://badge.fury.io/js/gulp-doT.png)](http://badge.fury.io/js/gulp-doT)
[![Coverage Status](https://coveralls.io/repos/kentliau/gulp-doT/badge.png)](https://coveralls.io/r/kentliau/gulp-doT)

[![NPM](https://nodei.co/npm/gulp-doT.png)](https://nodei.co/npm/gulp-doT/)

## Example

If we have following folder structure:

```
app/views/users/list.dot
app/views/users/detail.dot
app/views/products/list.dot
app/views/products/detail.dot
app/views/layout.dot
```

Then, running this code:

```js
var doT = require('gulp-doT'),
    concat = require('gulp-concat'), // npm install gulp-concat --save
    header = require('gulp-header'); // npm install gulp-header --save

gulp.task('templates', function() {
  gulp.src('app/views/**/*.dot')
  .pipe(doT())
  .pipe(concat('templates.js'))
  .pipe(header('window.render = {};'))
  .pipe(gulp.dest('public/js'));
});
```

Will produce `public/js/templates.js`:

```js
window.render = {};
render['users.list'] = function ...
render['users.detail'] = function ...
...
render['layout'] = function ...
```

## Options

* root --  prepend a name for the template name, default ''
* extension -- append a name for the template name, default ''
* separator -- separator for the name, default '.'
* dictionary -- template function name, default 'render'
* varname -- refer [doT](https://github.com/olado/doT), default 'data'
* strip -- refer [doT](https://github.com/olado/doT), default true
* append -- refer [doT](https://github.com/olado/doT), default true
* selfcontained -- refer [doT](https://github.com/olado/doT), default false

## License

MIT
