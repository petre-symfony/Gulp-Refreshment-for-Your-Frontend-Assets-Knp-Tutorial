var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function(){
   gulp.src('app/Resources/assets/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('web/css')); 
});

gulp.task('watch', function(){
  gulp.watch('app/Resources/assets/sass/**/*.scss', ['sass'])
});

gulp.task('default', ['sass']);
