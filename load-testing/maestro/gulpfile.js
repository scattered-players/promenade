const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');


gulp.task('develop', gulp.series((done) => {
  return nodemon({
    script: 'bin/www',
    ext: 'js ejs coffee',
    stdout: false,
    done: done
  }).on('readable', function () {
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
}));

gulp.task('default', gulp.series('develop'));

