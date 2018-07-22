const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = ['chrome', 'firefox'].map(platform => ({
  name: platform,
  entry: {
    popup_bundle: './src/js/popup.js',
  },
  output: {
    path: `${__dirname}/build/${platform}`,
    filename: 'js/[name].js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: `src/css/${platform}_style.css`, to: 'css/style.css' },
      { from: 'src/popup.html', to: 'popup.html' },
      { from: 'src/manifest.json', to: 'manifest.json' },
      { from: 'src/img', to: 'img' },
    ]),
    new CleanWebpackPlugin([`./build/${platform}`]),
  ],
}));
