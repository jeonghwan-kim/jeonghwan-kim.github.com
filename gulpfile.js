const gulp = require('gulp');
const sass = require('gulp-sass');
const gutil = require('gulp-util');
const child = require('child_process');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();

const pkg = require('./package.json').gulp;

gulp.task('scss', () => {
  gulp.src(pkg.scssEntry)
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest(`${pkg.static}`))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('bundle', ['exec', 'jekyll', 'build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = buffer => {
    buffer.toString()
      .split(/\n/)
      .forEach(message => {
        gutil.log('Jekyll: ' + message)
        const doneJekyll = /done in .* seconds/.test(message)
        if (doneJekyll) browserSync.reload()
      });
  };

  jekyll.stdout.on('data', jekyllLogger);
});

gulp.task('browserSync', () => {
  browserSync.init({
    port: 4000,
    server: {
      baseDir: pkg.siteRoot
    }
  });
});

gulp.task('webpack', () => {
  webpack(require('./webpack.config'))
    .pipe(gulp.dest('./assets'))
})

gulp.task('serve', ['browserSync', 'webpack', 'scss', 'jekyll'], () => {
  gulp.watch(pkg.jsFiles,  ['webpack']);
  gulp.watch(pkg.scssFiles,  ['scss']);
})

gulp.task('default', ['serve']);
