# gulp-dot-precompiler2

Better [Gulp](https://github.com/gulpjs/gulp) plugin for precompilation of [doT](https://github.com/olado/doT) templates. Forked from [kentliau/gulp-dot-precompiler](https://github.com/kentliau/gulp-dot-precompiler) with more control and bugfixes.



[![NPM](https://nodei.co/npm/gulp-dot-precompiler2.png?downloads=true&stars=true)](https://nodei.co/npm/gulp-dot-precompiler2/)


## Options

* root :  prepend a name for the template name, default ''
* extension : append a name for the template name, default ''
* separator : separator for the name, default '.'
* dictionary : template function name, default 'render'
* templateSettings : [doT](https://github.com/olado/doT) template settings

##Include Partial View

```
< p > This is the main view < / p >

{{#def.loadfile('./sub_view.def') }}
```

This will include the `sub_view.def` from the same directory where the `loadfile()` is called. Not necessary to use `.def` as extension.


###Now with Error emitter

listen error in your gulp file

```

gulp.task('templates', function() {
    gulp.src( src_template )
    .pipe(plugins['dot-precompiler']({
                                       dictionary:'render',
                                       selfcontained:true,
                                       append:true
                                     })
      .on('error', plugins['notify']
        .onError({ title: "ERROR",
                   message: "Error: <%= error.message %>" })))

    // Build multiple compressed version
    .pipe(plugins['rename']({ extname: '.blade.php' }))
    .pipe(plugins['uglify']())
    .pipe(gulp.dest( build_template['server'] ))

    // Build a concatenated version in public
    .pipe(plugins['concat']('all.min.js'))
    .pipe(plugins['header']('window.render=window.render||{};'))
    .pipe(plugins['uglify']())
    .pipe(gulp.dest( build_template['client'] ))
    .pipe(plugins['notify']({ title: 'OK', message: 'Templates task complete' }));
});
```


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
var dot = require('gulp-dot-precompiler'),
    concat = require('gulp-concat'), // npm install gulp-concat --save
    header = require('gulp-header'); // npm install gulp-header --save

gulp.task('templates', function() {
  gulp.src('app/views/**/*.dot')
  .pipe(dot())
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


## License

MIT
