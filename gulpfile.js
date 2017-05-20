var gulp = require('gulp');

var plugins = require('gulp-load-plugins')();


var config = {
  assetsDir: 'app/Resources/assets',
  bowerDir: 'vendor/bower_components',
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
    .pipe(plugins.concat('css/'+filename))
    .pipe(config.production ? plugins.minifyCss() : plugins.util.noop())
    .pipe(plugins.rev())
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
    .pipe(gulp.dest('web'))
    .pipe(plugins.rev.manifest('app/Resources/assets/rev-manifest.json'))
    .pipe(gulp.dest('.'));   
}

app.addScripts = function(paths, filename){
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
    .pipe(plugins.concat(filename))
    .pipe(config.production ? plugins.uglify() : plugins.util.noop())
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
    .pipe(gulp.dest('web/js'));   
}

app.copy = function(srcFiles, outputDir){
  gulp.src(srcFiles)
    .pipe(gulp.dest(outputDir));
}

gulp.task('styles', function(){
  app.addStyle([
    config.bowerDir+'/bootstrap/dist/css/bootstrap.css',
    config.bowerDir+'/font-awesome/css/font-awesome.css',
    config.assetsDir+'/sass/layout.scss',
    config.assetsDir+'/sass/styles.scss'
  ], 'main.css');
  
  app.addStyle([
     config.assetsDir+'/sass/dinosaur.scss',
  ], 'dinosaur.css');
});

gulp.task('scripts', function(){
  app.addScripts([
    config.bowerDir+'/jquery/dist/jquery.js',
    config.assetsDir+'/js/main.js'
  ], 'site.js');
});

gulp.task('fonts', function(){
  app.copy(
    config.bowerDir+'/font-awesome/fonts/*',
    'web/fonts'        
  )
});

gulp.task('watch', function(){
  gulp.watch(config.assetsDir + '/' + config.sassPattern, ['styles']);
  gulp.watch(config.assetsDir + '/js/**/*.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'fonts', 'watch']);
