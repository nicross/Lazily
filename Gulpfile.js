const cleancss = require('gulp-clean-css')
const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify-es').default

gulp.task('dist-css', () => {
  return gulp.src([
    'css/*.css',
  ]).pipe(
    cleancss()
  ).pipe(
    rename((path) => {
      path.extname = '.min.css'
    })
  ).pipe(
    gulp.dest('dist')
  )
})

gulp.task('dist-js', () => {
  return gulp.src([
    'js/Lazily.js',
    'js/LazilyLoaderPlugin.js',
    'js/LazilyRehydratorPlugin.js',
    'js/LazilyRevealerPlugin.js',
  ]).pipe(
    uglify()
  ).pipe(
    rename((path) => {
      path.extname = '.min.js'
    })
  ).pipe(
    gulp.dest('dist')
  )
})

gulp.task('dist', gulp.series('dist-css', 'dist-js'))
