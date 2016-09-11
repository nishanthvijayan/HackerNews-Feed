var buttons = require('sdk/ui/button/action');
var panels = require('sdk/panel');
var self = require('sdk/self');
var tabs = require('sdk/tabs');

var newsfeed = panels.Panel({
  width: 475,
  height: 100,
  contentURL: self.data.url('popup.html'),
  contentScriptFile: [self.data.url('jquery-3.1.0.min.js'),self.data.url('popup.js')]
});

newsfeed.port.on('postClicked', function (text) {
  tabs.open(text);
});

newsfeed.port.on('resizePanel', function () {
  newsfeed.resize(475,500);
});

var displayPopup = function(){
  newsfeed.show({ position: button });
};

var button = buttons.ActionButton({
  id: 'HackerNews-feed',
  label: 'Have a quick peek at the current Hacker News front page',
  icon: {
    '16': './img/icon16.png',
    '32': './img/icon32.png',
    '48': './img/icon48.png',
    '64': './img/icon48.png',
    '128':'./img/icon128.png'
  },
  onClick: displayPopup
})

exports.main = function (options, callbacks) {
    if(options.loadReason === 'install' || options.loadReason === 'upgrade') {
      tabs.open('http://nishanthvijayan.github.io/HackerNews-Feed/');
    }
};

exports.onUnload = function (reason) {
    if(reason === 'uninstall' || reason === 'disable') {
      tabs.open('https://docs.google.com/forms/d/e/1FAIpQLSdwJxBpFQzWnBFvqhrE-BuIFza-lMyOqsAD_w8c2o1WGVFS-g/viewform');
    }
};
