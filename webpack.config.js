var path = require('path');

module.exports = {
    entry: {
        "bahmni-util-commons": path.join(__dirname, 'src', 'bahmni-util-commons/init.js'),
        "bahmni-model-commons": path.join(__dirname, 'src', 'bahmni-model-commons/init.js'),
        "bahmni-auth-commons": path.join(__dirname, 'src', 'bahmni-auth-commons/init.js'),
        "bahmni-domain-commons": path.join(__dirname, 'src', 'bahmni-domain-commons/init.js'),
        "bahmni-appframework-commons": path.join(__dirname, 'src', 'bahmni-appframework-commons/init.js'),
        "bahmni-displaycontrols-commons": path.join(__dirname, 'src', 'bahmni-displaycontrols-commons/init.js'),
        "bahmni-config-commons": path.join(__dirname, 'src', 'bahmni-config-commons/init.js'),
        "bahmni-uihelper-commons": path.join(__dirname, 'src', 'bahmni-uihelper-commons/init.js'),
        "bahmni-patient-commons": path.join(__dirname, 'src', 'bahmni-patient-commons/init.js'),
        "bahmni-i18n-commons": path.join(__dirname, 'src', 'bahmni-i18n-commons/init.js'),
        "bahmni-logging-commons": path.join(__dirname, 'src', 'bahmni-logging-commons/init.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                // https://github.com/webpack/webpack/issues/512#issuecomment-288143187
                // test: /[\\\/]lib[\\\/]modernizr*\.js$/,
                test: /modernizr.custom/,
                use: [
                    { loader: 'imports-loader?this=>window'}
                ]
            },
            {
                test: /\.js$/,
                use: [
                    { loader: 'babel-loader' }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i, 
                loader: "url-loader",
                options: {
                    limit: Infinity // everything
                  }
            },
            {
                test: /\.html$/,
                use: [
                    { loader: 'html-loader' }
                ]
            }
        ]
    }
};