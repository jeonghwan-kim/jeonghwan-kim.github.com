const gulp = require('gulp');
const child = require('child_process');
const browserSync = require('browser-sync').create();
const gutil = require('gulp-util');
const sass = require('gulp-sass');

const pkg = require('./package.json').gulp;

gulp.task('css', () => {
  gulp.src(pkg.cssEntry)
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest(`${pkg.static}/css`));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('bundle', ['exec', 'jekyll', 'build',
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
    files: [
      `${pkg.siteRoot}/**`,
      `${pkg.static}/**`
    ],
    port: 4000,
    server: {
      baseDir: pkg.siteRoot
    }
  });

  gulp.watch(pkg.cssFiles, ['css']);
});

gulp.task('default', ['css', 'jekyll', 'serve']);
