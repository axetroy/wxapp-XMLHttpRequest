//index.js

const XMLHttpRequest = require('../../wxapp-XMLHttpRequest').default;

var app = getApp();
Page({
  data: {
    response: ''
  },
  onLoad: function() {
    const request = new XMLHttpRequest();

    request.timeout = 1000;

    request.ontimeout = function(err) {
      console.error(`request timeout`);
    };

    request.onerror = function(err) {
      console.error(err);
    };

    request.onreadystatechange = e => {
      console.log(e);
      if (request.readyState === 4) {
        console.log(request.response);
        console.log(request.status);
        console.log(request.statusText);
        this.setData({ response: request.response });
      }
    };

    request.onabort = function() {
      console.error(`request have been abort...`);
    };

    request.open('GET', 'https://www.baidu.com');

    request.setRequestHeader('hello', 'world 123');

    request.send('hello world');

    // request.abort();
  }
});
