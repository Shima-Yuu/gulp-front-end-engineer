# Pug & SCSS

## ◎ ディレクトリ構造

dist  
&ensp;&ensp;└ css  
&ensp;&ensp;└ img  
&ensp;&ensp;└ js  
&ensp;&ensp;└ index.html  
src  
&ensp;&ensp;└ before_compression  
&ensp;&ensp;&ensp;&ensp;└ css  
&ensp;&ensp;&ensp;&ensp;└ html  
&ensp;&ensp;└ img  
&ensp;&ensp;└ js  
&ensp;&ensp;└ pug  
&ensp;&ensp;└ scss

dist・・・コンパイルが完了したコード。ホスティングする用のファイル群  
src・・・こちらを編集する。  
before_compression・・・圧縮される前のコードを保管

【説明】  
src 配下を編集する。コンパイルされたデータが dist に格納される。圧縮されたコードが dist に格納されるため、「before_compression」に圧縮前のデータを保管している。

## ◎Step

### 1. gulp をインストール

```
npm i gulp --save-dev
```

### 2. package.json 作成

```
npm init -y
```

-package.json

```
{
  "name": "gulp-setup",
  "version": "1.0.0",
  "description": "front-end-engineer setup to gulp",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "npx gulp"
  },
  "keywords": [],
  "dependencies": {
    "browser-sync": "^2.26.3",
    "gulp-autoprefixer": "^6.0.0",
    "gulp-changed": "^3.2.0",
    "gulp-concat": "^2.6.1",
    "gulp-csso": "^3.0.1",
    "gulp-htmlmin": "^5.0.1",
    "gulp-imagemin": "^5.0.3",
    "gulp-notify": "^3.2.0",
    "gulp-plumber": "^1.2.1",
    "gulp-pug": "^4.0.1",
    "gulp-rename": "^1.4.0",
    "gulp-sass": "^4.0.2",
    "gulp-sourcemaps": "^2.6.5",
    "gulp-uglify": "^3.0.2",
    "uglify-es": "^3.3.9"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ],
  "devDependencies": {
    "gulp": "^4.0.2",
    "imagemin-mozjpeg": "^9.0.0",
    "imagemin-pngquant": "^9.0.2"
  }
}
```

### 3. node モジュールをインストール

```
npm install
```

### 4. gulpfile を作成

**ディレクトリ構造**  
gulpfile.js  
&ensp;&ensp;└ index.js  
&ensp;&ensp;└ modules.js

-index.js

```
// 名前付きインポート。gulp.src() ⇨ src()
const { src, dest, parallel, watch } = require("gulp");

// プラグインを読み込む。接頭辞に$をつける。
const $ = require("./modules.js");

// es6にも対応
const uglify = $.composer($.uglifyes, $.composer);

// ディレクトリのパスを指定
const path = {
  src: "./src",
  dist: "./dist",
};

// html圧縮
function html() {
  // src(取得ファイル,取得したくないパス)、アンダースコアから始まるpugファイルは出力しない。
  return src([`${path.src}/pug/*.pug`, `!${path.src}/pug/**/_*.pug`])
    .pipe(
      $.plumber({
        errorHandler: $.notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(
      $.pug({
        // 整形させる
        pretty: true,
      })
    )
    .pipe(dest(`${path.src}/before_compression/html`))
    .pipe(
      $.minifyHTML({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(dest(path.dist))
    .pipe(
      $.browserSync.reload({
        stream: true,
        once: true,
      })
    );
}

// css圧縮
function css() {
  return src(`${path.src}/scss/*.scss`)
    .pipe(
      $.plumber({
        errorHandler: $.notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write())
    .pipe(dest(`${path.src}/before_compression/css`))
    .pipe(
      $.rename({
        suffix: ".min",
      })
    )
    .pipe($.minifyCSS())
    .pipe(dest(`${path.dist}/css`))
    .pipe(
      $.browserSync.reload({
        stream: true,
        once: true,
      })
    );
}

// js圧縮
function js() {
  return src(`${path.src}/js/**/*.js`, { sourcemaps: true })
    .pipe(
      $.plumber({
        errorHandler: $.notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(
      $.rename({
        suffix: ".min",
      })
    )
    .pipe(uglify())
    .pipe(dest(`${path.dist}/js`, { sourcemaps: true }))
    .pipe(
      $.browserSync.reload({
        stream: true,
        once: true,
      })
    );
}

// 画像圧縮
function img() {
  return src(`${path.src}/img/**/**`)
    .pipe($.changed(`${path.dist}/img/`))
    .pipe(
      $.imagemin([
        $.pngquant({
          quality: [0.6, 0.7],
          speed: 1,
        }),
        $.mozjpeg({ quality: 85, progressive: true }),
        $.imagemin.svgo(),
        $.imagemin.optipng(),
        $.imagemin.gifsicle({ optimizationLevel: 3 }),
      ])
    )
    .pipe(dest(`${path.dist}/img/`));
}

// ホットリロード
function bs() {
  $.browserSync.init({
    server: {
      baseDir: path.dist,
    },
    notify: true,
    xip: false,
  });
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.bs = bs;
exports.img = img;

exports.default = parallel([html, css, js, img, bs], () => {
  watch(`${path.src}/pug/**`, html);
  watch(`${path.src}/scss/**`, css);
  watch(`${path.src}/js/**`, js);
  watch(`${path.src}/img/**`, img);
});
```

-module.js

```
// プラグインを読み込む。
module.exports = {
  // pugのコンパイル
  pug: require("gulp-pug"),
  // scssのコンパイル
  sass: require("gulp-sass"),
  // HTMLの圧縮
  minifyHTML: require("gulp-htmlmin"),
  // CSSの圧縮
  minifyCSS: require("gulp-csso"),
  // ホットリロード
  browserSync: require("browser-sync"),
  // エラーが原因でタスクが強制停止するのを防ぐ
  plumber: require("gulp-plumber"),
  // 発生したエラーをデスクトップ通知で伝える
  notify: require("gulp-notify"),
  // cssのプレフィックスを自動付与
  autoprefixer: require("gulp-autoprefixer"),
  // ソースマップの作成
  sourcemaps: require("gulp-sourcemaps"),
  // ファイルをリネームする
  rename: require("gulp-rename"),
  // 画像を圧縮する(svg,gif)
  imagemin: require("gulp-imagemin"),
  // jpgを圧縮する
  mozjpeg: require("imagemin-mozjpeg"),
  // pngを圧縮する
  pngquant: require("imagemin-pngquant"),
  // ファイルを変更時に処理が発火する
  changed: require("gulp-changed"),
  // es6のコードを扱う
  uglifyes: require("uglify-es"),
  // es6のコードを圧縮
  composer: require("gulp-uglify/composer"),
};


```

### 5. 実行

```
npx gulp
```
