const path = require('path');
//const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  target: "web",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              "@babel/plugin-syntax-jsx",
              ["@babel/plugin-transform-react-jsx", { "pragma": "ChangyDom.createElementJSX" }],
              "syntax-async-functions"
            ]
          }
        }
      }
    ],
  },
  resolve: {
    extensions: [ '.js' ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    disableHostCheck: true,
    host: "0.0.0.0"
  },
  externals: []
};