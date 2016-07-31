var argv = require('yargs').argv;

var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'tests.webpack.js'
    ],

    preprocessors: {
      // add webpack as preprocessor
      'tests.webpack.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    },

    plugins: [
      'karma-coverage',
      'karma-mocha',
      'karma-chai',
      'karma-webpack',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-sourcemap-loader'
    ],

    reporters: ['spec', 'progress', 'coverage'],

    coverageReporter: {
      instrumenterOptions: {
        istanbul: { noCompact: true}
      },
      reporters: [
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html' },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' }
      ]
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
    singleRun: !argv.watch
  });
};
