const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: './public',
    hot: true,
    port: 8080,
    proxy: [
      {
        context: '/api',
        target: 'http://localhost:3000'
      },
      {
        context: '/login',
        target: 'http://localhost:3000'
      },
      {
        context: '/logout',
        target: 'http://localhost:3000'
      }
    ]
  }
};