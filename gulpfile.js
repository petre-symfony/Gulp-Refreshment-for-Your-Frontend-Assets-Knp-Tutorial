var gulp = require('gulp');

var plugins = require('gulp-load-plugins')();


var config = {
  assetsDir: 'app/Resources/assets',
  sassPattern: 'sass/**/*.scss',
  production: !!plugins.util.env.production,
  sourceMaps: !plugins.util.env.production
}

var app = {};

app.addStyle = function(paths, filename){
  gulp.src(paths)
    .pipe(
      plugins.if(
        config.sourceMaps, 
        plugins.plumber(function(error){
          console.log(error.toString());
          this.emit('end')
        })
      )
    )
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
    .pipe(plugins.sass())
    .pipe(plugins.concat(filename))
    .pipe(config.production ? plugins.minifyCss() : plugins.util.noop())
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
    .pipe(gulp.dest('web/css'));   
}

gulp.task('sass', function(){
  gulp.src([
    config.assetsDir+'/sass/layout.scss',
    config.assetsDir+'/sass/styles.scss'
  ])
    .pipe(
      plugins.if(
        config.sourceMaps, 
        plugins.plumber(function(error){
          console.log(error.toString());
          this.emit('end')
        })
      )
    )
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
    .pipe(plugins.sass())
    .pipe(plugins.concat('main.css'))
    .pipe(config.production ? plugins.minifyCss() : plugins.util.noop())
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
    .pipe(gulp.dest('web/css')); 
});

gulp.task('watch', function(){
  gulp.watch(config.assetsDir + '/' + config.sassPattern, ['sass'])
});

gulp.task('default', ['sass', 'watch']);
