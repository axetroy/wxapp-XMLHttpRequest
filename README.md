# wxapp-XMLHttpRequest

[![Greenkeeper badge](https://badges.greenkeeper.io/axetroy/wxapp-XMLHttpRequest.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/axetroy/wxapp-XMLHttpRequest.svg?branch=master)](https://travis-ci.org/axetroy/wxapp-XMLHttpRequest)
[![Dependency](https://david-dm.org/axetroy/wxapp-XMLHttpRequest.svg)](https://david-dm.org/axetroy/wxapp-XMLHttpRequest)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)
![Node](https://img.shields.io/badge/node-%3E=6.0-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/wxapp-XMLHttpRequest.svg)](https://badge.fury.io/js/wxapp-XMLHttpRequest)

微信小程序的XMLHttpRequest实现

## Installation
```bash
npm install wxapp-XMLHttpRequest --save
```

[example](https://github.com/axetroy/wxapp-XMLHttpRequest/tree/master/example)

## Features

- [x] 使用typescript构建，更严谨
- [x] 基本符合W3C标准

## Usage

```javascript

// es6
import XMLHttpRequest from 'wxapp-XMLHttpRequest';

// commonJS
const XMLHttpRequest = require('wxapp-XMLHttpRequest').default;

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
```

## Related

[wxapp-fetch](https://github.com/axetroy/wxapp-fetch) fetch API implement for WeCHat App

[@axetroy/event-emitter.js](https://github.com/axetroy/event-emitter.js) A Javascript event emitter implementation without any dependencies. only 1.4Kb

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
