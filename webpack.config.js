const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
    worker: path.resolve(__dirname, './src/worker.js'),
  },
  devServer: {
    contentBase: './dist',
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    clean: true
  },
  resolve: {
    fallback: {
        "fs": false
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
     title: 'Development',
     template: 'index.html',
     chunks : ['main'],
     cache: false
    }),
  ]
}