# wxapp-XMLHttpRequest

[![Greenkeeper badge](https://badges.greenkeeper.io/axetroy/wxapp-XMLHttpRequest.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/axetroy/wxapp-XMLHttpRequest.svg?branch=master)](https://travis-ci.org/axetroy/wxapp-XMLHttpRequest)
[![Dependency](https://david-dm.org/axetroy/wxapp-XMLHttpRequest.svg)](https://david-dm.org/axetroy/wxapp-XMLHttpRequest)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)
![Node](https://img.shields.io/badge/node-%3E=6.0-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/wxapp-XMLHttpRequest.svg)](https://badge.fury.io/js/wxapp-XMLHttpRequest)

微信小程序的XMLHttpRequest实现

让你在微信小程序中使用Web(看起来)标准的Ajax接口调用

不建议生产环境中使用，可以使用[wxapp-http](https://github.com/axetroy/wxapp-http)或[wxapp-fetch](https://github.com/axetroy/wxapp-fetch)

纯属学习...

## Installation
```bash
npm install wxapp-XMLHttpRequest --save
```

[example](https://github.com/axetroy/wxapp-XMLHttpRequest/tree/master/example)


## Usage

```javascript

// es6
import XMLHttpRequest from 'wxapp-XMLHttpRequest';

// commonJS
const XMLHttpRequest = require('wxapp-XMLHttpRequest').default;

const request = new XMLHttpRequest();

console.dir(request);

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
    console.log(request.status);
    console.log(request.statusText);
    console.log(request.getResponseHeader('Status'));
    console.log(request.getAllResponseHeaders());
    console.log(request.response);
    this.setData({ response: request.response });
  }
};

request.onabort = function() {
  console.error(`request have been abort...`);
};

request.open('GET', 'https://api.github.com');

request.setRequestHeader('hello', 'world 123');

request.send('hello world');

// request.abort();
```

## Related

[wxapp-fetch](https://github.com/axetroy/wxapp-fetch) fetch API implement for WeCHat App

[wxapp-http](https://github.com/axetroy/wxapp-http) 微信小程序的http模块，Tiny but Powerful

[wxapp-r2](https://github.com/axetroy/wxapp-r2) r2 implement in Wechat App client

## Contributing

```bash
git clone https://github.com/axetroy/wxapp-XMLHttpRequest.git
cd ./wxapp-XMLHttpRequest
yarn
yarn run start
```

1. 打开微信web开发者工具， 加载wxapp-XMLHttpRequest/example目录
2. 修改index.ts

欢迎PR.

You can flow [Contribute Guide](https://github.com/axetroy/wxapp-XMLHttpRequest/blob/master/contributing.md)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroy/wxapp-XMLHttpRequest/commits?author=axetroy "Code") [🔌](#plugin-axetroy "Plugin/utility libraries") [⚠️](https://github.com/axetroy/wxapp-XMLHttpRequest/commits?author=axetroy "Tests") [🐛](https://github.com/axetroy/wxapp-XMLHttpRequest/issues?q=author%3Aaxetroy "Bug reports") [🎨](#design-axetroy "Design") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

The [MIT License](https://github.com/axetroy/wxapp-XMLHttpRequest/blob/master/LICENSE)
