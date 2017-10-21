//index.js

const XMLHttpRequest = require('../../wxapp-XMLHttpRequest').default;

var app = getApp();
Page({
  data: {
    response: ''
  },
  onLoad: function() {

    const request = new XMLHttpRequest();

    request.timeout = 100;


    request.ontimeout = function(err) {
      console.error(`timeout...`);
      console.error(err);
    };

    request.onerror = function(err) {
      console.error(err);
    };

    request.onreadystatechange = (e) => {
      console.log(e);
      if (request.readyState === 4) {
        console.log(request.response);
        // this.setData({ response: request.response });
      }
    };

    request.open('GET', 'https://www.baidu.com');

    request.setRequestHeader('hello', 'world 123');

    request.send('hello world');
  }
});
