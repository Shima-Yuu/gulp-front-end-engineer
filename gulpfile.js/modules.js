module.exports = {
  pug: require("gulp-pug"),
  sass: require("gulp-sass"),
  minifyHTML: require("gulp-htmlmin"),
  minifyCSS: require("gulp-csso"),
  browserSync: require("browser-sync"),
  plumber: require("gulp-plumber"),
  notify: require("gulp-notify"),
  autoprefixer: require("gulp-autoprefixer"),
  sourcemaps: require("gulp-sourcemaps"),
  rename: require("gulp-rename"),
  imagemin: require("gulp-imagemin"),
  mozjpeg: require("imagemin-mozjpeg"),
  pngquant: require("imagemin-pngquant"),
  changed: require("gulp-changed"),
  uglifyes: require("uglify-es"),
  composer: require("gulp-uglify/composer"),
};
