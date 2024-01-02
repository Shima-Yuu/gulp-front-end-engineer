# Gulp

## 環境構築

### 1. Node モジュールをインストール

assets ディレクトリに移動します。

```
.../themes/テーマ名> cd assets
```

各パッケージをインストール

```
.../themes/テーマ名/assets> npm i
```

### 2. .env ファイルの設定

assets ディレクトリ配下の「[sample.env](assets/sample.env)」をコピーして、同階層に「.env」ファイルを作成する  
.env ファイルの下記変数をローカル環境に合わせて書き換える

```
# 例）
LOCAL_URL=http://wp_template.com/
THEME_NAME=base
```

上記で「ローカルサイト」「Style Guide」の 2 つのページがブラウザで立ち上がります。  
ブラウザシンクの機能を利用して、効率化を図るので基本はこちらのタスクで作業を進めていただければと思います。

## タスクの概要

**ブラウザシンク、scss コンパイル、画像の圧縮、スタイルガイド作成**

```
gulp dev
```

**SCSS のコンパイル & 画像の圧縮、webp 化**

```
gulp run
```

**スタイルガイドを作成/更新する際に使用するタスク。(ファイルを編集する度にスタイルガイドページも更新されます)**

```
gulp styleGuide
```

**SCSS コンパイル専用(watch なし)**

```
gulp compile
```
