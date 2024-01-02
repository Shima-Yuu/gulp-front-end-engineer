const { src, dest, watch, series } = require('gulp');
const gulp = require('gulp');
const config = require('./settings/config.js');
const $ = require('./settings/modules.js');
const { createFolders } = require('./settings/functions.js');
const {
  scssCompress,
  styleGuide,
  styleGuideLoad,
  EJScompile,
  imgCompress,
} = require('./tasks');

function init(done) {
  createFolders(config.src_path.imgFolder, config.dest_path.css.min);
  styleGuide();
  scssCompress();
  styleGuideLoad(done);
}

function styleGuideSync() {
  require('browser-sync').create('styleGuide').init({
    host: 'localhost',
    port: 8889,
    ui: { port: 8889 },
    mode: 'proxy',
    proxy: `${process.env.LOCAL_URL}wp-content/themes/${process.env.THEME_NAME}/assets/styleGuide/`,
  });
}

function watchFiles(done) {
  gulp.watch(config.scss, scssCompress);
  gulp.watch(config.src_path.img, imgCompress);
  done();
}

function dev(done) {
  $.browserSync.init({
    host: 'localhost',
    port: 8888,
    mode: 'proxy',
    files: ['../**/*.php', './**/*.js', '../**/*.html', './**/*.scss', './**/*.ejs'],
    proxy: process.env.LOCAL_URL,
  });

  styleGuideSync();
  gulp.watch(config.scss, scssCompress);
  gulp.watch(['./**/*.ejs', '!./src/_*.ejs'], EJScompile);
  gulp.watch(config.src_path.img, imgCompress);
  done();
}

function styleGuideTask(done) {
  styleGuideSync();
  gulp.watch(config.scss, series(scssCompress, styleGuideLoad));
  done();
}

exports.scss = series(init, watchFiles);

exports.dev = series(init, dev);

exports.styleGuide = series(init, styleGuideTask);