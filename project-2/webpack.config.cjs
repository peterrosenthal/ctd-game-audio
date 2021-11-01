const path = require('path');
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

module.exports = {
  entry: './ts/main.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts'],
    plugins: [new ResolveTypeScriptPlugin({
      includeNodeModules: true
    })]
  },
  output: {
    filename: 'dist/bundle.js',
    path: path.resolve(__dirname)
  }
};
