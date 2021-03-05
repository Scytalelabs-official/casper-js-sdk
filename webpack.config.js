const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const common = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
};

const serverConfig = {
  ...common,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  },
  externals: [nodeExternals()] // in order to ignore all modules in node_modules folder
};

const clientConfig = {
  ...common,
  target: 'web',
  resolve: {
    ...common.resolve,
    fallback: {
      stream: require.resolve('stream-browserify'),
      asert: require.resolve('assert'),
      buffer: require.resolve('buffer/'),
      fs: false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
};

module.exports = [serverConfig, clientConfig];
