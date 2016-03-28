var gulp = require('gulp');

gulp.task('default', function() {
    gulp.src('node_modules/bootstrap/dist/css/bootstrap.css').pipe(gulp.dest('public/css/'));
    gulp.src('node_modules/bootstrap/dist/js/bootstrap.js').pipe(gulp.dest('public/js/'));
    gulp.src('node_modules/vue/dist/vue.js').pipe(gulp.dest('public/js/'));
    gulp.src('node_modules/vue-resource/dist/vue-resource.js').pipe(gulp.dest('public/js/'));
    gulp.src('node_modules/jquery/dist/jquery.js').pipe(gulp.dest('public/js/'));    
}); 