const gulp = require('gulp');
const child = require('child_process');
const browserSync = require('browser-sync').create();
const gutil = require('gulp-util');
const sass = require('gulp-sass');

const pkg = require('./package.json'); // todo use pkg variables
const siteRoot = '_site';
const cssFiles = '_css/main.scss';

gulp.task('css', () => {
  gulp.src(cssFiles)
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('assets'));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(cssFiles, ['css']);
});

gulp.task('default', ['css', 'jekyll', 'serve']);
