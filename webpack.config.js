var webpack = require('webpack');

module.exports = {
  entry: './public/js/main.js',
  output: {
    path: __dirname,
    filename: './public/assets/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({ "global.GENTLY": false }),
    // new webpack.optimize.UglifyJsPlugin({comments: /a^/, compress: {warnings: false}})
  ],
  watch: true
};
