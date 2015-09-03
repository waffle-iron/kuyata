var dest = "./www";
var src = './app';

module.exports = {

    sass: {
        src: src + "/app.scss",
        dest: dest + "/styles/",
        settings: {
            imagePath: '/images' // Used by the image-url helper
        }
    },

    browserify: {
        // Enable source maps
        debug: true,
        // Additional file extensions to make optional
        extensions: [],
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
            entries: '../../app/app.js',
            dest: dest + '/scripts/',
            outputName: 'app.js'
        }]
    },

    markup: {
        src: src + "/**/*.html",
        dest: dest
    },

    misc: {
        font: {
            src: "./fonts/**",
            dest: dest + "/fonts/"
        },

        distDir: dest
    },

    test: {
        karmaConf: __dirname + '/../karma.conf.js'
    },

    stubby: {
        src: ['api_mocks/*.{json,yaml,js}']
    },

    browsersync: {
        baseDir: dest
    },

    serve: {
        watchDir: './www/**/*'
    }
};