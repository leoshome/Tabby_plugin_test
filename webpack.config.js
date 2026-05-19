const path = require('path')

module.exports = {
  target: 'node',
  entry: './src/index.ts',
  devtool: 'source-map',
  context: __dirname,
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  resolve: {
    modules: ['.'].concat(
      ['src', 'node_modules'].map(x => path.join(__dirname, x))
    ),
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
          transpileOnly: true,
        },
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
      {
        test: /\.scss$/,
        use: ['@tabby-gang/to-string-loader', 'css-loader', 'sass-loader'],
      },
      
    ],
  },
  externals: [
    'fs',
    'ngx-toastr',
    /^rxjs/,
    /^@angular/,
    /^@ng-bootstrap/,
    /^tabby-/,
  ],
}