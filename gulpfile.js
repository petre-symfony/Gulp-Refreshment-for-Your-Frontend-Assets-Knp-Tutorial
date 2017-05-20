var gulp = require('gulp');

var plugins = require('gulp-load-plugins')();


var config = {
  assetsDir: 'app/Resources/assets',
  sassPattern: 'sass/**/*.scss',
  production: !!plugins.util.env.production,
  sourceMaps: !plugins.util.env.production
}

gulp.task('sass', function(){
   gulp.src(config.assetsDir + '/' + config.sassPattern)
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
