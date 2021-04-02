const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const concat = require('gulp-concat')
const image = require('gulp-image')
const autoprefixer = require('gulp-autoprefixer')
const del = require('del')
const sync = require('browser-sync')
const pug = require('gulp-pug')
const htmlmin = require('gulp-htmlmin')

function toHtml() {
	return src('src/**.pug')
		.pipe(pug())
		.pipe(dest('src'))
}

function scss() {
	return src('src/scss/**.scss')
	 .pipe(sass())
	 .pipe(autoprefixer())
	 .pipe(csso())
	 .pipe(concat('index.css'))
	 .pipe(dest('dist'))
}

function minifyHTML() {
	return src('src/index.html')
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
		.pipe(dest('dist'));
}

function clear() {
	return del('dist')
}

function clearSrc() {
	return del('src/index.html')
}

function img() {
	return src('src/img/*')
	 .pipe(image())
	 .pipe(dest('dist/img'))
}

function serve() {
	sync.init({
		server: './dist'
	})

	watch(['src/**.pug', 'src/parts/**.pug'], series(pug)).on('change', sync.reload)
	watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
}

exports.test = series(clear, toHtml, scss)
exports.build = series(clear, img, scss, toHtml, minifyHTML, clearSrc)
exports.server = series(clear, img, scss, toHtml, serve)
exports.clear = clear
