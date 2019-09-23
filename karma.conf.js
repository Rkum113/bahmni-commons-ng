const webpackConfig = require('./webpack.config.js');

module.exports = (config) => {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        browsers: ['jsdom'],
        browserNoActivityTimeout: 100000,
        autoWatch: false,
        singleRun: true,
        files: [
            {pattern: 'node_modules/angular/angular.js', watched: false},
            {pattern: 'node_modules/angular-mocks/angular-mocks.js', watched: false},
            {pattern: 'node_modules/moment/min/moment.min.js', watched: false},
            {pattern: 'node_modules/jquery/jquery.js', watched: false},
            {pattern: 'node_modules/offline/offline.js', watched: false},
            {pattern: 'node_modules/lodash/lodash.js', watched: false},
            {pattern: 'node_modules/@uirouter/angularjs/release/angular-ui-router.js', watched: false},
            {pattern: 'node_modules/q/q.js', watched: false},
            {pattern: 'node_modules/jasmine-jquery/lib/jasmine-jquery.js', watched: false},

            {pattern: 'test/lib/**/*.js', watched: false},
            {pattern: 'test/support/*.js', watched: false},
            {pattern: 'test/init-constants.js', watched: false},

            {pattern: 'dist/bahmni-util-commons.js', watched: false},
            {pattern: 'dist/bahmni-model-commons.js', watched: false},
            {pattern: 'dist/bahmni-auth-commons.js', watched: false},
            {pattern: 'dist/bahmni-appframework-commons.js', watched: false},
            {pattern: 'dist/bahmni-displaycontrols-commons.js', watched: false},
            {pattern: 'dist/bahmni-config-commons.js', watched: false},
            {pattern: 'dist/bahmni-patient-commons.js', watched: false},
            {pattern: 'test/**/*spec.js', watched: false},
        ],
        reporters: ['junit', 'progress', 'coverage'],
        preprocessors: {
            'dist/**/*.js': ['webpack', 'coverage'],
        },
        coverageReporter: {
            reporters: [
                {type: 'json', dir: 'coverage/'},
                {type: 'html', dir: 'coverage/'},
                {type: 'text-summary'}
            ]
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: 'errors-only',
        },
    });
};
