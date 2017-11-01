const gulp = require('gulp');

const browserSync = require("browser-sync");
const reload = browserSync.reload;
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;

const named = require('vinyl-named');
const del = require('del');
const pngquant = require('imagemin-pngquant');

// require all plugins 
const plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});
// plugins doc : 
// const sass = require('gulp-sass - https://www.npmjs.com/package/gulp-sass
// const watch = require('gulp-watch'); - https://www.npmjs.com/package/gulp-sass
// const rigger = require('gulp-rigger'); - https://www.npmjs.com/package/gulp-rigger
// uses construction   //= footer.html  to add partils 
// const minifyCss = require('gulp-minify-css'); - https://www.npmjs.com/package/gulp-minify-css
// const uglify = require('gulp-uglify'); - https://www.npmjs.com/package/gulp-uglify
// const minifyHTML = require('gulp-minify-html'); - https://www.npmjs.com/package/gulp-minify-html
// const autoprefixer = require('gulp-autoprefixer');
// const imagemin = require('gulp-imagemin');
// const gulpif = require('gulp-if'); // if else plugin
// const changed = require('gulp-changed'); // work only with changed files
// const sourcemaps = require('gulp-sourcemaps'); 
// const concatjs = require('gulp-concat');
// const spritesmith = require('gulp.spritesmith'); // sprite builder 
// const notify = require('gulp-notify'); // pretty notify errors
// const plumber = require('gulp-plumber'); // sets errors to all pipes
// const debug = require('gulp-debug'); // let debug gulp processes
// const neat = require('node-neat').includePaths; // wat for 
// const babel = require('gulp-babel');
// sftp - https://github.com/gtg092x/gulp-sftp 
// fontmin - https://www.npmjs.com/package/gulp-fontmin
// new test packages 
// const cached = require('gulp-cached');
// const path = require('path');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

// CONFIG     
let config = { // gulp development config
    checkChanged: true, // Check if files where before // cant turn ON CHANGED BEFORE it // test if works if files where deleted
    minifyHTML: true, // on prod stage
    minifyCSS: true,
    uglifyJS: true,
    concatJS: false,
    minifyPHP: true,
    showGulpDebug: true,
    removeJsConsoleLogDev: false, // true to delete all console.log
    removeJsConsoleLog: true, // true to delete all console.log
    fontMinify: false, // think no need if not using chinese fonts , unstable option
    showSizes: true,
}
let BrowserSyncConfig = {
    server: { baseDir: "./dev/" },
    tunnel: false,
    host: 'localhost',
    port: 9451,
    open: false,
    notify: true,
    scrollProportionally: false,
    logPrefix: "Frontend",
    // proxy: "http://inchoo.net/magento/magento-frontend/a-simple-frontend-workflow-for-gulp/",
    // middleware: require('serve-static')('./dev'),
    // files: "./dev/style/main.css",
    // rewriteRules: [
    //     {
    //         match: new RegExp('</head>'),
    //         fn: function() {
    //             return '<script async="" src="/browser-sync/browser-sync-client.2.9.6.js"></script>' +
    //                 '<link rel="stylesheet" type="text/css" href="/css/main.css" media="all"><script src="/js/responsive.js" type="text/javascript"></script></head >'
    //         }
    //     },
    //     {
    //         match: new RegExp('<link rel="up" href="/">'),
    //         fn: function() {
    //             return '<link rel="stylesheet" type="text/css" href="/css/music.css" media="all">'
    //         }
    //     },
    //     {
    //         match: '<link rel="stylesheet" type="text/css" href="/f/1/business/find_solutions/smeLandingNew.css?1.1" media="all">',
    //         fn: function() {
    //             return '<link rel="stylesheet" type="text/css" href="/f/1/business/find_solutions/smeLandingNew.css?1.1" media="all"><link rel="stylesheet" type="text/css" href="/css/find-solutions.css" media="all">'
    //         }
    //     },
    //     // removing already deployed assets
    //     {
    //         match: new RegExp('/f/1/mm/tariffs/contract/global/main.css'),
    //         fn: function() {
    //             return ''
    //         }
    //     },
    //     {
    //         match: new RegExp('/f/1/mm/tariffs/contract/global/responsive.js'),
    //         fn: function() {
    //             return ''
    //         }
    //     }
    // ],
};
let webpackConfig = {
};

// HTML min options
let htmlMinOptions = {
    conditionals: true,
    spare: true
};
// Path options 
// let path = require('/gulptasks/path')
let path = {
    src: {
        html: 'src/templates/*.html',
        htmlWatch: 'src/templates/**/*.html',
        style: 'src/style/*.{scss,sass}',
        js: 'src/js/**/*.js',
        img: ['src/img/**/*.*', '!src/img/sprite/**/*.*'], // all images but not sprites
        sprite: 'src/img/sprite/*.*',
        spriteCss: 'src/style/sprite',
        php: 'src/**/*.php',
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
    },
    prod: {
        root: 'prod/',
        style: 'prod/style',
        img: 'prod/img',
        js: 'prod/js',
        fonts: 'prod/fonts',
        vendor: 'prod/vendor',
    }
};


// Webserver start task 
gulp.task('webserver', function () {
    browserSync(BrowserSyncConfig);
});

// Dev/prod
gulp.task('check-enviroment', function () {
    console.group('Check eniroment. Enviroment is dev : ' + isDevelopment);
    // if (isDevelopment) {gulpOptions = {}}
    // else {gulpOptions = {}}
});


// Task that runs when syntax error to prevent gulp crush
// function swallowError(error) {
//     console.log(error.toString());
//     this.emit('end');
// }

// gulp.on('err', function (err) {
//     console.log(err);
// });

// DEVELOPMENT BUILDING TASKS
// HTML src --> development
gulp.task('build:html', function () {
    gulp.src(path.src.html)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(function (err) {
                return {
                    title: 'Build html error',
                    message: err.message
                }
            })
        }))
        // .pipe(plugins.if(config.checkChanged ,plugins.changed(path.dev.htmlDest)))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug('changed html: ')))
        .pipe(plugins.rigger())// uses construction   //= footer.html  to add partils 
        .pipe(gulp.dest(path.dev.htmlDest))
        .pipe(reload({ stream: true }));
});
gulp.task('build:html-partial', function () {
    gulp.src(path.src.html)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(function (err) {
                return {
                    title: 'Build partials html error',
                    message: err.message
                }
            })
        }))
        .pipe(plugins.changed(path.dev.htmlDest))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug('changed html: ')))
        .pipe(plugins.rigger())// uses construction   //= footer.html  to add partils 
        .pipe(gulp.dest(path.dev.htmlDest))
        .pipe(reload({ stream: true }));
});
// CSS src --> development
// stuff for css compilation
let autoprefixer = require('autoprefixer')
let mqpacker = require('css-mqpacker')
let csso = require('postcss-csso')
var processors = [
    autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
    }),
    require('lost'),
    mqpacker({
        sort: sortMediaQueries
    }),
    csso
];
function isMax(mq) {
    return /max-width/.test(mq);
}
function isMin(mq) {
    return /min-width/.test(mq);
}
function sortMediaQueries(a, b) {
    A = a.replace(/\D/g, '');
    B = b.replace(/\D/g, '');
    if (isMax(a) && isMax(b)) {
        return B - A;
    } else if (isMin(a) && isMin(b)) {
        return A - B;
    } else if (isMax(a) && isMin(b)) {
        return 1;
    } else if (isMin(a) && isMax(b)) {
        return -1;
    }
    return 1;
}
gulp.task('build:style', function () {
    gulp.src(path.src.style)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(function (err) {
                return {
                    title: 'Build style error',
                    message: err.message
                }
            })
        }))
        .pipe(plugins.if(true, plugins.sourcemaps.init()))

        .pipe(plugins.sass({
            outputStyle: 'nested', // nested, expanded, compact, compressed
            precision: 5
        }))
        .pipe(plugins.postcss(processors))
        .pipe(plugins.if(true, plugins.sourcemaps.write('./')))
        .pipe(gulp.dest(path.dev.styleDest)) // build css in folder 
        .pipe(browserSync.stream()) // livereload page
});
// stuff for css compilation END
// JS src --> development
gulp.task('build:js', function () {
    gulp.src(['src/js/main.js'])
        // gulp.src(['src/js/vendor/*.js','src/js/*.js'])
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(function (err) {
                return {
                    title: 'Build JS error',
                    message: err.message
                }
            })
        }))
        .pipe(named())
        // .pipe(webpackStream(webpackConfig))
        .pipe(plugins.if(config.removeJsConsoleLogDev, plugins.removeLogging()))
        .pipe(plugins.babel({ presets: ['es2015'] })) // es6 -> es5
        .pipe(plugins.if(config.concatJS, plugins.concat('main.js'))) // build js to 1 file 
        .pipe(gulp.dest(path.dev.jsDest))
        .pipe(browserSync.stream()); // livereload page
});
//relocate images to dev
gulp.task('build:img', function () {
    gulp.src(path.src.img)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(function (err) {
                return {
                    title: 'Image build error',
                    message: err.message
                }
            })
        }))
        .pipe(plugins.if(config.checkChanged, plugins.changed('dev/img')))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug()))
        .pipe(gulp.dest(path.dev.imgDest))
        .pipe(browserSync.stream());
});
// Build sprite
gulp.task('build:sprite', function () {
    var spriteData = gulp.src('src/img/sprite/*.png')
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(function (err) {
                return {
                    title: 'Sprite build error',
                    message: err.message
                }
            })
        }))
        .pipe(plugins.spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            imgPath: '../img/sprite.png',
            retinaImgPath: '../img/sprite@2x.png',
            retinaSrcFilter: 'src/img/sprite/*@2x.png',
            retinaImgName: 'sprite@2x.png',

        }));
    spriteData.img.pipe(gulp.dest("dev/img")) // path where save sprite image
        .pipe(plugins.if(config.checkChanged, plugins.debug({ "title": "sptire images generated: " })));

    spriteData.css.pipe(gulp.dest(path.src.spriteCss)) // path where save sprite css
        .pipe(plugins.if(config.checkChanged, plugins.debug({ "title": "sptire css generated: " })));
});
// Lint Php
gulp.task('build:php', function () { // test
    return gulp.src(path.src.php)
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(function (err) {
                return {
                    title: 'Php build error',
                    message: err.message
                }
            })
        }))
        .pipe(plugins.phplint())
        .pipe(plugins.phplint.reporter('fail'))
        .pipe(gulp.dest('dev/'))
});
// replace fonts 
gulp.task('build:fonts', function () {
    let destination = 'dev/fonts/';
    return gulp.src('src/fonts/**/*.*')
        .pipe(plugins.if(config.checkChanged, plugins.changed(destination)))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug('fonts files added: ')))
        .pipe(gulp.dest(destination))
        .pipe(browserSync.stream());
})
// replace vendor files & media 
gulp.task('build:vendor', function () {
    let destination = 'dev/vendor/';
    return gulp.src('src/vendor/**/*.*')
        .pipe(plugins.if(config.checkChanged, plugins.changed(destination)))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug('vendor files added: ')))
        .pipe(gulp.dest(destination))
        .pipe(reload({ stream: true }));
})
gulp.task('build:vendor-js', function () {
    let dest = 'dev/js/vendor/';
    return gulp.src('src/js/vendor/**/*.*')
        .pipe(plugins.if(config.checkChanged, plugins.changed(dest)))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug('vendor js files added: ')))
        .pipe(gulp.dest(dest))
        .pipe(reload({ stream: true }));
});

// clear some
gulp.task("clear", function () {
    return del(
        ['dev/style/main.css'],
        { read: false } // preven from insert object in memory
    );
});


// DEVELOPMENT BUILDING TASKS END

gulp.task('build', [
    'build:html',
    'build:style',
    'build:js',
    'build:vendor-js',
    'build:img',
    'build:vendor',
    'build:sprite',
    'build:php',
    'build:fonts',
]);
// 

// Watcher that will autoupdate development
gulp.task('watch', function () {
    // watch HTML to Build All
    plugins.watch('src/templates/*/*.html', function (event, cb) {
        gulp.start('build:html');
    });
    // watch HTML to Build 
    plugins.watch(path.src.html, function (event, cb) {
        gulp.start('build:html-partial');
    });
    // Watch HTML to livereload
    plugins.watch([path.dev.html], function (event, cb) {
        gulp.src(path.dev.html)
            .pipe(browserSync.stream());
    });
    // Watch Scss to build
    // watch([path.src.style], function(event, cb) {
    plugins.watch([path.src.style, 'src/style/*/*.scss'], function (event, cb) {
        gulp.start('build:style');
    });
    // Watch js to concat and livereload
    plugins.watch(path.src.js, function (event, cb) {
        gulp.start('build:js');
    });
    // Watch images
    plugins.watch(path.src.img, function (event, cb) {
        gulp.start('build:img');
    });
    //Watch sprites
    plugins.watch([path.src.sprite], function (event, cb) {
        gulp.start('build:sprite');
        gulp.start('build:style');
    });
    //Watch php
    plugins.watch([path.src.php], function (event, cb) {
        gulp.start('build:php');
    });
    plugins.watch('src/vendor/**/*.*', function () {
        gulp.start('build:vendor');
    });
    plugins.watch('src/fonts/**/*.*', function () {
        gulp.start('build:fonts');
    });
    plugins.watch('src/js/vendor/**/*.*', function () {
        gulp.start('build:vendor-js');
    });
});
// 



// gulp.task('sftp', function () { 
//     return gulp.src("prod/**/*.*")
//         .pipe(plugins.plumber({
//             errorHandler: plugins.notify.onError(function (err) {
//                 return {
//                     title: 'Image build error',
//                     message: err.message
//                 }
//             })
//         }))
//         .pipe(plugins.sftp({
//             host: 'ef674.mirohost.net',
//             user: 'ht007',
//             port: 22,
//             pass: 'QzaYmnCYN1rl',
//             remotePath: '/public_html/sftp-test', // reccomend ssh
//         }))
//         .pipe(plugins.debug())
// })

// To production stage
gulp.task("prod", [
    'prod:html',
    'prod:php',
    'prod:style',
    'prod:js',
    'prod:fonts',
    'prod:img',
    'prod:htaccess',
    'prod:vendor',
]);

gulp.task('prod:html', function () {
    let destination = path.prod.root;
    gulp.src('dev/*.html')
        .pipe(plugins.if(config.checkChanged, plugins.changed(destination))) // NEED TO DETALIZE HOW DETECT IF FILE WAS DELETED 
        .pipe(plugins.if(config.showSizes, plugins.size({
            title: 'size before min : '
        })))
        .pipe(plugins.if(config.minifyHTML, plugins.minifyHtml(htmlMinOptions)))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug({ title: 'Changed html min files : ' })))
        .pipe(gulp.dest(destination))
        .pipe(plugins.if(config.showSizes, plugins.size({
            title: 'size after min : '
        })))
});
gulp.task('prod:style', function () {
    let destination = path.prod.style;
    gulp.src('dev/style/*.css')
        .pipe(plugins.if(config.checkChanged, plugins.changed(destination)))
        .pipe(plugins.if(config.showSizes, plugins.size({
            title: 'size before min : '
        })))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug({ title: 'Minified css : ' })))
        .pipe(plugins.if(config.minifyCSS, plugins.minifyCss({ compatibility: 'ie8' })))
        .pipe(gulp.dest(destination))
        .pipe(plugins.if(config.showSizes, plugins.size({
            title: 'size after min : '
        })))
});
gulp.task('prod:js', function () { // Minify all js files
    let destination = path.prod.js;
    gulp.src(['dev/js/**/*.js', '!main.css.map'])
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(function (err) {
                return {
                    title: 'Pord JS error',
                    message: err.message
                }
            })
        }))
        .pipe(plugins.if(config.checkChanged, plugins.changed(destination)))
        .pipe(plugins.if(config.removeJsConsoleLog, plugins.removeLogging())) // remove all console logs
        .pipe(plugins.if(config.showSizes, plugins.size({
            title: 'size before min : '
        })))
        .pipe(plugins.if(config.uglifyJS, plugins.uglify())) // uglify 
        .pipe(plugins.if(config.showGulpDebug, plugins.debug({ title: 'Uglified js : ' })))
        .pipe(gulp.dest(destination))
        .pipe(plugins.if(config.showSizes, plugins.size({
            title: 'size after min : '
        })))
});
gulp.task('prod:fonts', function () {
    del("prod/fonts/*.*", { read: false }); // clear all old files 
    gulp.src("dev/fonts/**/*.*")
        .pipe(plugins.if(config.checkChanged, plugins.changed("prod/fonts")))
        .pipe(plugins.if(config.fontMinify, plugins.fontmin()))
        .pipe(gulp.dest(path.prod.fonts));
});
gulp.task('prod:img', function () {
    let destination = path.prod.img;
    return gulp.src("dev/img/**/*.*")
        .pipe(plugins.if(config.checkChanged, plugins.changed(destination)))
        .pipe(plugins.if(config.showSizes, plugins.size({
            title: 'size before min : '
        })))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug({ title: 'images changed: ' })))
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(destination))
        .pipe(plugins.if(config.showSizes, plugins.size({
            title: 'size after min : '
        })))
});
gulp.task('prod:php', function () { // test
    let destination = path.prod.root;
    gulp.src('dev/**/*.php')
        .pipe(plugins.plumber({
            errorHandler: plugins.notify.onError(function (err) {
                return {
                    title: 'PHP',
                    message: err.message
                }
            })
        }))
        .pipe(plugins.if(config.checkChanged, plugins.changed(destination)))
        .pipe(plugins.if(config.showSizes, plugins.size({
            title: 'size before min : '
        })))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug({ title: 'PHP files minified' })))
        .pipe(plugins.if(config.minifyPHP, plugins.phpMinify({ silent: true })))
        .pipe(gulp.dest(destination))
        .pipe(plugins.if(config.showSizes, plugins.size({
            title: 'size after min : '
        })))
});
gulp.task('prod:htaccess', function () {
    gulp.src('src/**/.htaccess')
        .pipe(plugins.if(config.checkChanged, plugins.changed(path.prod.root)))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug({ title: 'htaccess rewriten : ' })))
        .pipe(gulp.dest(path.prod.root))
})
gulp.task('prod:vendor', function () {
    // let takeFrom = 'src/vendor/**/*.*';
    let takeFrom = 'dev/vendor/**/*.*';
    let destination = path.prod.vendor;
    return gulp.src(takeFrom)
        .pipe(plugins.if(config.checkChanged, plugins.changed(destination)))
        .pipe(plugins.if(config.showGulpDebug, plugins.debug('vendor files added: ')))
        .pipe(gulp.dest(destination))
})

gulp.task("build-prod", [
    'build', 'prod'
]);

gulp.task('default', ['build', 'webserver', 'watch']);