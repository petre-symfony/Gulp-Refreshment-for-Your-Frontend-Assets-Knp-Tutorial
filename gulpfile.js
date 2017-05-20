var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');

var config = {
  assetsDir: 'app/Resources/assets',
  bowerDir: 'vendor/bower_components',
  sassPattern: 'sass/**/*.scss',
  production: !!plugins.util.env.production,
  sourceMaps: !plugins.util.env.production,
  revManifestPath: 'app/Resources/assets/rev-manifest.json'
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
    ).on('end', function(){ console.log('start '+filename)})
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
    .pipe(plugins.sass())
    .pipe(plugins.concat('css/'+filename))
    .pipe(config.production ? plugins.minifyCss() : plugins.util.noop())
    .pipe(plugins.rev())
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
    .pipe(gulp.dest('web'))
    .pipe(plugins.rev.manifest(config.revManifestPath, {
      merge: true
    }))
    .pipe(gulp.dest('.')).on('end', function(){ console.log('end '+filename)});   
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
    .pipe(plugins.concat('js/'+filename))
    .pipe(config.production ? plugins.uglify() : plugins.util.noop())
    .pipe(plugins.rev())
    .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
    .pipe(gulp.dest('web'))
    .pipe(plugins.rev.manifest(config.revManifestPath, {
      merge: true
    }))
    .pipe(gulp.dest('.'));     
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

gulp.task('clean', function(){
  del.sync(config.revManifestPath);
  del.sync('web/css/*');
  del.sync('web/js/*');
  del.sync('web/fonts/*');
});

gulp.task('watch', function(){
  gulp.watch(config.assetsDir + '/' + config.sassPattern, ['styles']);
  gulp.watch(config.assetsDir + '/js/**/*.js', ['scripts']);
});

gulp.task('default', ['clean', 'styles', 'scripts', 'fonts', 'watch']);
