const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = [
	{
    name: "chrome",
    entry: {
      "popup_bundle" : "./src/js/popup.js",

    },
    output:{
      path: __dirname + '/build/chrome', 
      filename: 'js/[name].js'
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'src/css/chrome_style.css', to: 'css/style.css' },
        { from: 'src/popup.html', to: 'popup.html' },
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/img', to: 'img' },
      ]),
      new CleanWebpackPlugin(['./build/chrome'])
    ]
  },
  {
    name: "firefox",
    entry: {
      "popup_bundle" : "./src/js/popup.js",
    },
    output:{
      path: __dirname + '/build/firefox', 
      filename: 'js/[name].js'
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'src/css/firefox_style.css', to: 'css/style.css' },
        { from: 'src/popup.html', to: 'popup.html' },
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/img', to: 'img' },
      ]),
      new CleanWebpackPlugin(['./build/firefox'])
    ]
	}
]
