var gulp = require('gulp');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var stripdebug = require('gulp-strip-debug');
var concat = require('gulp-concat');
var deporder = require('gulp-deporder');
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var connect = require('gulp-connect');

var folder = {
    src: 'src/',
    dist: 'dist/'
}
var devMODE = process.env.NODE_ENV !== 'production';
gulp.task('html', function() {
    var page = gulp.src(folder.src + 'html/*')
                   .pipe(connect.reload());
    if(!devMODE) {
        page.pipe(htmlclean());
    }
    page.pipe(gulp.dest(folder.dist + 'html/'));
});

gulp.task('images', function() {
    gulp.src(folder.src + 'images/*')
        .pipe(connect.reload())
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist + 'images/'));
})

gulp.task('js', function() {
    var js = gulp.src(folder.src + 'js/*')
                 .pipe(connect.reload());
    if(!devMODE) {
        js.pipe(deporder())
          .pipe(concat('main.js'))
          .pipe(uglify())
          .pipe(stripdebug())
    }
    js.pipe(gulp.dest(folder.dist + 'js/'));
})

gulp.task('css', function() {

    var css = gulp.src(folder.src + 'css/*')
                  .pipe(less())
                  .pipe(connect.reload());
    var options = [autoprefixer()];
    if(!devMODE) {
        options.push(cssnano());
    }

    css.pipe(postcss(options))
       .pipe(gulp.dest(folder.dist + 'css/'));
})

gulp.task('watch', function() {
    gulp.watch(folder.src + 'html/*', ['html']);
    gulp.watch(folder.src + 'images/*', ['images']);
    gulp.watch(folder.src + 'js/*', ['js']);
    gulp.watch(folder.src + 'css/*', ['css']);
})

gulp.task('connect', function() {
    connect.server({
        port: '8081',
        livereload: true
    })
})
gulp.task('default', ['html', 'images', 'js', 'css', 'watch', 'connect']);