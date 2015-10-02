var webpack = require('webpack');

module.exports = {
  entry: './public/js/main.js',
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.js$/, loader: 'babel-loader?stage=0&optional=runtime' }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({ "global.GENTLY": false }),
    new webpack.optimize.UglifyJsPlugin({comments: /a^/, compress: {warnings: false}})
  ]
};