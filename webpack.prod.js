const common = require('./webpack.config');
const {merge} = require('webpack-merge');

module.exports = common.map((config) => merge(config, {
    mode: 'production',
    devtool: false
}));
