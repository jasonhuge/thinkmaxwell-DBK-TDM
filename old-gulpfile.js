//gulp
var gulp = require("gulp"),
//gulp sass
sass = require("gulp-sass"),
//auto prefixer
autoprefixer = require('gulp-autoprefixer'),
//css minimizer
cssnano = require('gulp-cssnano'),
//js hint
jshint = require('gulp-jshint'),
//uglifier
uglify = require('gulp-uglify'),
//image minimizer
imagemin = require('gulp-imagemin'),
//renamer
rename = require('gulp-rename'),
//concatinater
concat = require('gulp-concat'),
//notifier
notify = require('gulp-notify'),
//cache plugin
cache = require('gulp-cache'),
//php
php = require('gulp-connect-php'),
//reloader
browserSync = require('browser-sync'),

merge = require("merge-stream"),

del = require('del');



//SASS
gulp.task("sass", function(){
	return gulp.src('src/css/style.scss')
	.pipe(sass().on('error', sass.logError)) 
	.pipe(cssnano())
	.pipe(autoprefixer('last 2 version'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

//SCRIPTS
gulp.task("scripts", function(){
	var scripts = gulp.src(["src/js/**/*.js", "!src/js/vendor/*.js"])
	.pipe(jshint(".jshintrc"))
	.pipe(jshint.reporter("default"))
	.pipe(concat("App.js"))
	.pipe(gulp.dest("dist/js"))
	.pipe(uglify())
	.pipe(gulp.dest("dist/js"))
	.pipe(notify({message:"Scripts task complete"}));
	
	var vendor = gulp.src("src/js/vendor/*.js")
	.pipe(concat("Vendor.js"))
	.pipe(gulp.dest("dist/js"))
	.pipe(uglify())
	.pipe(gulp.dest("dist/js"))
	.pipe(notify({message:"Vendor scripts task complete"}));
	
	return merge(scripts, vendor);
});

//IMAGES
gulp.task("images", function(){
	return gulp.src("src/img/**/*", {base:"src/img"})
	.pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
	.pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

//FILES
gulp.task("copy-files", function(){
	var fonts = gulp.src("src/fonts")
	.pipe(gulp.dest("dist"));
	
	var files = gulp.src(["src/**/*.{xml,png,html,ico,txt,php,mp3,swf}", "!src/img/**/*"], {base:"src"})
	.pipe(gulp.dest("dist"));
	
	var jsmap = gulp.src("src/js/vendor/*.map")
	.pipe(gulp.dest("dist/js"))
	
	return merge(fonts, files, jsmap);
});

//PHP
gulp.task("php", function(){
	php.server({base:"dist", port: 8010, keepalive: true});
});

//SYNC
gulp.task("browser-sync", gulp.series("php"), function(){
	browserSync({
		//ENTER PATH TO DIST FOLDER
		proxy:"localhost/~jasonhughes/",
		port:8080,
		open:true,
		notify:false
	});
	
	gulp.watch("src/css/**/*.scss", ["styles"]);
	gulp.watch("src/js/**/*.js", ["scripts"]);
	gulp.watch("src/images/**/*", ["images"]);
	gulp.watch("src/**/*.{xml,png,html,ico,txt,php,mp3,swf,map", ["copy-files"]);
});

//CLEAN
gulp.task("clean", function(){
	return del(["dist/img", "dist/css", "dist/js", "dist/fonts"]);
});

var reload = browserSync.reload;

gulp.task("default", gulp.series("clean", "browser-sync"), function(){
	gulp.start("sass", "scripts", "images", "copy-files");
});





