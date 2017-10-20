//index.js

const XMLHttpRequest = require('../../wxapp-XMLHttpRequest').default;

var app = getApp();
Page({
  data: {
    success: 0,
    fail: 0
  },
  onLoad: function() {
    const request = new XMLHttpRequest();

    request.timeout = 100;

    request.ontimeout = function() {
      console.error(`timeout...`);
    };

    request.setRequestHeader('hello', 'world 123');

    request.open('GET', 'https://www.baidu.com');

    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        console.log(request.response);
      }
    };

    request.onerror = function(err) {
      console.error(err);
    };

    request.send('hello world');
  }
});
