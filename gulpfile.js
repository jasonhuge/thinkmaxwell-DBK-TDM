const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const browsersync = require('browser-sync');
const gulpcopy = require('gulp-copy');
const del = require('del');
const notify = require('gulp-notify');
const merge = require("merge-stream");
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const php = require('gulp-connect-php');


/*
 * Directories here
 */
var paths = {
    build: './dist/',
    scss: './src/scss/',
    data: './src/data/',
    js: './src/js/'
};

// SCSS bundled into CSS task
function css() {
	var css = src('src/scss/style.scss')
	.pipe(plumber({
        handleError: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', function (err) {
        console.log(err.message);
        // sass.logError
        this.emit('end');
    }))
    .pipe(prefix(['last 15 versions','> 1%','ie 8','ie 7','iOS >= 9','Safari >= 9','Android >= 4.4','Opera >= 30'], {
        cascade: true
    }))
    .pipe(cssnano())
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
    
    var vendor = src("src/scss/vendor/*.css")
    .pipe(cssnano())
	.pipe(concat("vendor.min.css"))
	.pipe(sourcemaps.write('.'))
	.pipe(dest("dist/css"))
	.pipe(notify({ message: 'Vendor Styles task complete' }));

	return merge(css, vendor);
	
}

// JS bundled into min.js task
function js() {
	var scripts = src(["src/js/**/*.js", "!src/js/vendor/*.js"])
	.pipe(sourcemaps.init())
	//.pipe(jshint(".jshintrc"))
	.pipe(jshint.reporter("default"))
	.pipe(concat("App.js"))
	.pipe(dest("dist/js"))
	.pipe(uglify())
	.pipe(dest("dist/js"))
	.pipe(sourcemaps.write('.'))
	.pipe(notify({message:"Scripts task complete"}));
	
	var vendor = src("src/js/vendor/*.js")
	.pipe(concat("Vendor.js"))
	.pipe(dest("dist/js"))
	.pipe(uglify())
	.pipe(dest("dist/js"))
	.pipe(notify({message:"Vendor scripts task complete"}));
	
	return merge(scripts, vendor);
}

function images() {
	return src("src/img/**/*", {base:"src/img"})
	.pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
	.pipe(dest('dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
}

/**
 * Copy assets directory
 */
function copyAssets() {
    var fonts = src("src/fonts")
	.pipe(dest("dist"));
	
	var files = src(["src/**/*.{xml,png,html,ico,txt,php,mp3,json}", "!src/img/**/*"], {base:"src"})
	.pipe(dest("dist"));
	
	var jsmap = src("src/js/vendor/*.map")
	.pipe(dest("dist/js"))
	.pipe(notify({ message: 'Coppy Assets task complete' }));
	
	return merge(fonts, files, jsmap);
}

function clean() {
	return del(["dist/img", "dist/css", "dist/js", "dist/fonts"]);
}

// BrowserSync
function browserSync() {
	php.server({base:"dist", port: 8010, keepalive: true});
	
    browsersync({
        proxy: 'localhost:8010',
        baseDir: paths.build,
        notify: false,
        open:true,
        browser: "safari"
    });
}

// BrowserSync reload 
function browserReload () {
    return browsersync.reload;
}

// Watch files
function watchFiles() {
    // Watch SCSS changes    
    watch(paths.scss + '**/*.scss', parallel(css))
    .on('change', browserReload());
    // Watch javascripts changes    
    watch(paths.js + '**/*.js', parallel(js))
    .on('change', browserReload());
    watch('src/images/**/*', parallel(images))
    .on('change', browserReload())
    // Assets Watch and copy to build in some file changes
    watch('src/**/*.{xml,png,html,ico,txt,php,mp3,map,json}', parallel(copyAssets))
    .on('change', browserReload());
}

const watching = parallel(watchFiles, browserSync);

exports.js = js;
exports.css = css;
exports.default = series(clean, css, js, copyAssets, images);
exports.watch = watching;

