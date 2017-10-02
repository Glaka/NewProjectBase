var gulp = require('gulp'),
sass = require('gulp-sass'),
watch = require('gulp-watch'),
rigger = require('gulp-rigger'),
neat = require('node-neat').includePaths,
browserSync = require("browser-sync"),
minifyCss = require('gulp-minify-css'),
reload = browserSync.reload,
uglify = require('gulp-uglify'),
minifyCss = require('gulp-minify-css'),
minifyHTML = require('gulp-minify-html'),
autoprefixer = require('gulp-autoprefixer'),
imagemin = require('gulp-imagemin'),
spritesmith = require('gulp.spritesmith'),
concatjs = require('gulp-concat'),
pngquant = require('imagemin-pngquant'),
babel = require('gulp-babel'),
changed = require('gulp-changed');

// CONFIG     
var config = {
    server: {baseDir: "./dev/"},
    tunnel: false,
    host: 'localhost',
    port: 9777,
    open: true,
    notify: false,
    scrollProportionally: false,
    logPrefix: "Frontend"
};
// HTML min options
var opts = {
    conditionals: true,
    spare:true
};
// Path options 
var path = {
    src: {
        html: 'src/templates/*.html',
        htmlWatch: ['src/templates/*/*.html','src/templates/*.html'],
        style: 'src/style/*.scss',
        js: ['src/js/*/*.js','src/js/*.js'],
        img: 'src/img/*.*',
        sprite: 'src/img/sprite/*.*',
        spriteHover: 'src/img/sprite-hover/*.*',
        spriteCss: 'src/style/sprite',
    },
    dev: {
        htmlDest: 'dev/',
        html: 'dev/*.html',
        styleDest: 'dev/style',
        style: 'dev/style/*.css',
        jsDest: 'dev/js',
        js: 'dev/js/*.js',
        imgDest: 'dev/img',
        sprite: 'dev/img/sprite',
        spriteHover: 'dev/img/sprite-hover',
    },
    prod: {
        html: 'prod/',
        style: 'prod/style',
        js: 'prod/js',      
        img: 'prod/img'  
    }
};

// START PROJECT 
gulp.task('start', function(){
    return gulp.dest("/wwww");
});
// START PROJECT END

// Webserver start task 
gulp.task('webserver', function () {
    browserSync(config);
});

// Task that runs when syntax error to prevent gulp crush
function swallowError (error) {
    console.log(error.toString());
    console.log("error has been swaloved");
    this.emit('end');
}
gulp.on('err', function(err){
  console.log(err);
});

// DEVELOPMENT BUILDING TASKS
// HTML src --> development
gulp.task('html:build', function () {
    gulp.src(path.src.html)
    // .pipe(changed(path.dev.htmlDest))
    .pipe(rigger()).on('error', swallowError) // uses construction   //= footer.html  to add partils 
    // .pipe(minifyHTML(opts))
    .pipe(gulp.dest(path.dev.htmlDest)).on('error', swallowError)  
    .pipe(reload({stream: true}));
});
gulp.task('html:build-partial', function () {
    gulp.src(path.src.html)
    .pipe(changed(path.dev.htmlDest))
    .pipe(rigger()).on('error', swallowError) // uses construction   //= footer.html  to add partils 
    // .pipe(minifyHTML(opts))
    .pipe(gulp.dest(path.dev.htmlDest)).on('error', swallowError)  
    .pipe(reload({stream: true}));
});
// CSS src --> development
gulp.task('style:build', function () {
    gulp.src(path.src.style) // get scss from 
    .pipe(sass({
        includePaths: ['style:build'].concat(neat) // concat to 1 file 
    })).on('error', swallowError)
    .pipe(autoprefixer({browsers: ['last 5 versions', 'IE 7']})).on('error', swallowError)
    .pipe(gulp.dest(path.dev.styleDest)) // build css in folder 
    .pipe(browserSync.stream()); // livereload page
});
// JS src --> development
gulp.task('js:build', function () {
    gulp.src([
        'src/js/vendor/*.js',
        'src/js/*.js'
        ])
    .pipe(babel({presets: ['es2015']})).on('error', swallowError) // es6 -> es5
    .pipe(concatjs('main.js')).on('error', swallowError) // build js to 1 file 
    .pipe(gulp.dest(path.dev.jsDest)) // build css in folder 
    .pipe(browserSync.stream()); // livereload page
});
//relocate images to dev
gulp.task('img:build',function(){
    gulp.src(path.src.img)
    .pipe(gulp.dest(path.dev.imgDest))
    .pipe(browserSync.stream());
});
// Build sprite
gulp.task('sprite:build',function(){
    var spriteData =
    gulp.src(path.src.sprite)
    .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        cssFormat: 'css',
    }));
    spriteData.img.pipe(gulp.dest(path.dev.styleDest)); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest(path.src.spriteCss)); // путь, куда сохраняем стили
});


// DEVELOPMENT BUILDING TASKS END

gulp.task('build', [
    'html:build',
    'style:build',
    'js:build',
    'img:build',
    'sprite:build'
    ]);
// 

// Watcher that will autoupdate development
gulp.task('watch', function(){
    // watch HTML to Build All
    watch('src/templates/*/*.html', function(event, cb) {
        gulp.start('html:build');
    });
    // watch HTML to Build 
    watch(path.src.html, function(event, cb) {
        gulp.start('html:build-partial');
    });
    // Watch HTML to livereload
    watch([path.dev.html], function(event,cb){
        gulp.src(path.dev.html)
        .pipe(browserSync.stream());
    });
    // Watch Scss to build
    // watch([path.src.style], function(event, cb) {
        watch([path.src.style, 'src/style/*/*.scss'], function(event, cb) {
            gulp.start('style:build');
        });
    // Watch js to concat and livereload
    watch(path.src.js, function(event, cb) {
        gulp.start('js:build');
    });
    // Watch images
    watch([path.src.img], function(event,cb){
        gulp.start('img:build');
    });
    //Watch sprites
    watch([path.src.sprite], function(event,cb){
        gulp.start('sprite:build');
    });
    // Watch js to livereload
    // watch([path.dev.js], function(event, cb) {
    //     gulp.src(path.dev.js)
    //     .pipe(browserSync.stream());
    // });
});
// 


// To production stage
gulp.task("prod", [
    'prod-html',
    'prod-style',
    'prod-js',
    'prod-fonts',
    'prod-img',
    'prod-sprite',
    ]);

gulp.task('prod-html', function(){
    gulp.src(path.dev.html)
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(path.prod.html));
});
gulp.task('prod-style', function(){
    gulp.src(path.dev.style)
    .pipe(autoprefixer({browsers: ['last 5 versions', 'IE 7']}))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(path.prod.style));
});
gulp.task('prod-js', function(){
    gulp.src([path.dev.js])
    .pipe(uglify()).on('error', swallowError)
    .pipe(gulp.dest(path.prod.js));
});
gulp.task('prod-fonts', function(){
    gulp.src("dev/fonts/*.*")
    .pipe(gulp.dest("prod/fonts/*.*"));
});
gulp.task('prod-img', function(){
    return gulp.src(path.src.img)
    .pipe(imagemin({ 
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true

    }))
    .pipe(gulp.dest(path.prod.img))  
})
gulp.task('prod-sprite', function(){
    return gulp.src("dev/style/sprite.png")
    .pipe(imagemin({ 
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true

    }))
    .pipe(gulp.dest("prod/style"))  
})
// 

gulp.task('default', ['build', 'webserver', 'watch']);