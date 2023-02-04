const { dest, watch, parallel, series } = require("gulp");
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const autoPref = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const del = require('del')
const browserSync = require("browser-sync").create();

const htmlFile = "./app/index.html";
const scssFiles = "./app/scss/**/*.scss";
const mainJsFile = "./app/js/main.js";

function server() {
  browserSync.init({
    server: {
      baseDir: "./app",
    },
    notify: false,
  });
}

function styles() {
  return gulp
    .src(scssFiles)
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(concat("style.min.css"))
    .pipe(
      autoPref({
        overrideBrowserslist: ["last 5 version"],
        grid: true,
      })
    )
    .pipe(dest("./app/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(["./node_modules/jquery/dist/jquery.min.js", mainJsFile])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("./app/js"))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src("./app/images/**/*.*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("./dist/images"));
}

function build() {
  return gulp
    .src(["app/**/*.html", 
          "app/css/style.min.css", 
          "app/js/main.min.js"], 
        {
          base: "app",
        })
    .pipe(dest("dist"));
}

function cleanDist() {
  return del('dist')
}

function watching() {
  watch(scssFiles, { events: "change" }, styles);
  watch(mainJsFile, scripts);
  watch(htmlFile).on("change", browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.images = images;
exports.server = server;
exports.cleanDist = cleanDist
exports.build = series(cleanDist, images, build)

exports.default = parallel(styles, scripts, watching, server);
