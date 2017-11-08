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

module.exports = path;