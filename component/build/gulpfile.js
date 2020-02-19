const { series, src, dest } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');

function compileCss() {
    return src('./src/**/*.scss')
        .pipe(sass.sync())
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cssmin())
        .pipe(dest('./dist'));
}

function moveUmdCss() {
    return src('./dist/style/index.css')
        .pipe(dest('./dist/umd'));
}

// 与 compileCss 合在一起总会出现 dest 未执行完就执行 sass
function moveScss() {
    return src('./src/style/*.scss')
        .pipe(dest('./dist/style'));
}

exports.build = series(moveScss, compileCss, moveUmdCss);
