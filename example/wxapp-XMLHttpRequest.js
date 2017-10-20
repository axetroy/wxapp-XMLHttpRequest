(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["XMLHttpRequest"] = factory();
	else
		root["XMLHttpRequest"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by axetroy on 17-6-23.
 */
/// <reference path="./index.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _EventTarget = /** @class */ (function () {
    function _EventTarget() {
        this.listeners = {};
    }
    _EventTarget.prototype.addEventListener = function (type, callback) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    };
    _EventTarget.prototype.removeEventListener = function (type, callback) {
        if (!(type in this.listeners)) {
            return;
        }
        var stack = this.listeners[type];
        for (var i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
                stack.splice(i, 1);
                return this.removeEventListener(type, callback);
            }
        }
    };
    _EventTarget.prototype.dispatchEvent = function (event) {
        if (!(event.type in this.listeners)) {
            return;
        }
        var stack = this.listeners[event.type];
        event.target = this;
        for (var i = 0, l = stack.length; i < l; i++) {
            stack[i].call(this, event);
        }
    };
    return _EventTarget;
}());
var XMLHttpRequestEventTarget = /** @class */ (function (_super) {
    __extends(XMLHttpRequestEventTarget, _super);
    function XMLHttpRequestEventTarget() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onabortHandler = function (err) { };
        _this.onerrorHandler = function (err) { };
        _this.ontimeoutHandler = function (err) { };
        return _this;
    }
    Object.defineProperty(XMLHttpRequestEventTarget.prototype, "onabort", {
        get: function () {
            return this.onabortHandler || null;
        },
        set: function (func) {
            this.onabortHandler = func;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequestEventTarget.prototype, "onerror", {
        get: function () {
            return this.onerrorHandler || null;
        },
        set: function (func) {
            this.onerrorHandler = func;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequestEventTarget.prototype, "ontimeout", {
        get: function () {
            return this.ontimeoutHandler || null;
        },
        set: function (func) {
            this.ontimeoutHandler = func;
        },
        enumerable: true,
        configurable: true
    });
    return XMLHttpRequestEventTarget;
}(_EventTarget));
var UNSENT = 0;
var OPENED = 1;
var HEADERS_RECEIVED = 2;
var LOADING = 3;
var DONE = 4;
var _XMLHttpRequest = /** @class */ (function (_super) {
    __extends(_XMLHttpRequest, _super);
    function _XMLHttpRequest() {
        var _this = _super.call(this) || this;
        _this.DONE = DONE;
        _this.LOADING = LOADING;
        _this.HEADERS_RECEIVED = HEADERS_RECEIVED;
        _this.OPENED = OPENED;
        _this.UNSENT = UNSENT;
        return _this;
    }
    return _XMLHttpRequest;
}(XMLHttpRequestEventTarget));
var XMLHttpRequest = /** @class */ (function (_super) {
    __extends(XMLHttpRequest, _super);
    function XMLHttpRequest() {
        var _this = _super.call(this) || this;
        _this.method = 'GET';
        _this.async = true;
        _this.requestHeader = {};
        _this.__responseHeader = {};
        _this.aborted = false;
        _this.requestTask = null; // 微信小程序返回的questTask，用于取消请求任务
        _this.__readyState = UNSENT;
        _this.onreadystatechangeHandler = function () { };
        _this.withCredentials = false;
        _this.__responseType = '';
        _this.__response = null;
        _this.__responseStatus = 0;
        _this.__timeout = 0;
        return _this;
    }
    Object.defineProperty(XMLHttpRequest.prototype, "readyState", {
        get: function () {
            return this.__readyState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "onreadystatechange", {
        set: function (callback) {
            this.onreadystatechangeHandler = callback;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "response", {
        get: function () {
            return this.__response;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "responseText", {
        get: function () {
            return typeof this.__response === 'object'
                ? JSON.stringify(this.__response)
                : this.__response;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "timeout", {
        get: function () {
            return this.__timeout;
        },
        set: function (millisecond) {
            this.__timeout = millisecond;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "status", {
        get: function () {
            return this.__responseStatus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "statusText", {
        get: function () {
            return this.status + '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(XMLHttpRequest.prototype, "responseType", {
        get: function () {
            return this.__responseType;
        },
        enumerable: true,
        configurable: true
    });
    // method
    XMLHttpRequest.prototype.overrideMimeType = function (mimetype) {
        if (this.readyState >= HEADERS_RECEIVED) {
            throw new Error("Can not apply 'overrideMimeType' after send data");
        }
    };
    /**
     * fake to open the server
     * @param method
     * @param url
     * @param async
     * @param user
     * @param password
     */
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (async === void 0) { async = true; }
        if (user === void 0) { user = null; }
        if (password === void 0) { password = null; }
        this.method = method;
        this.url = url;
        this.async = async;
        this.user = user;
        this.password = password;
    };
    /**
     * send data
     * @param data
     */
    XMLHttpRequest.prototype.send = function (data) {
        var _this = this;
        this.__readyState = UNSENT;
        this.onreadystatechangeHandler();
        this.__readyState = OPENED;
        this.onreadystatechangeHandler();
        this.__readyState = HEADERS_RECEIVED;
        this.onreadystatechangeHandler();
        this.__readyState = LOADING;
        this.onreadystatechangeHandler();
        var timer = null;
        var haveTimeout = false;
        if (this.timeout > 0) {
            timer = setTimeout(function () {
                haveTimeout = true;
                _this.requestTask.abort();
                _this.ontimeoutHandler(new Error("Timeout " + _this.timeout + " ms"));
            }, this.timeout);
        }
        this.requestTask = this.requestTask = wx.request({
            url: this.url,
            method: this.method,
            header: this.requestHeader,
            data: data,
            dataType: 'json',
            success: function (res) {
                if (haveTimeout)
                    return;
                timer && clearTimeout(timer);
                _this.__responseStatus = res.statusCode;
                _this.__responseHeader = res.header;
                _this.__response = res.data === void 0 ? null : res.data;
                if (_this.__responseStatus >= 400) {
                    _this.onerrorHandler(new Error(res.errMsg));
                }
            },
            fail: function (res) {
                if (haveTimeout)
                    return;
                timer && clearTimeout(timer);
                _this.__responseStatus = res.statusCode;
                _this.__responseHeader = res.header;
                _this.__response = res.data === void 0 ? null : res.data;
                _this.onerrorHandler(new Error(res.errMsg));
            },
            complete: function () {
                if (haveTimeout)
                    return;
                _this.__readyState = DONE;
                _this.onreadystatechangeHandler();
            }
        });
    };
    /**
     * abort the request after send
     */
    XMLHttpRequest.prototype.abort = function () {
        typeof this.requestTask === 'function' && this.requestTask();
        this.aborted = true;
    };
    /**
     * set request header
     * @param header
     * @param value
     */
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        this.requestHeader[header] = value + '';
    };
    /**
     * get response header
     * @param header
     * @returns {null}
     */
    XMLHttpRequest.prototype.getResponseHeader = function (header) {
        var val = this.__responseHeader[header];
        return val !== undefined ? val : null;
    };
    /**
     * get all response header string
     * @returns {string}
     */
    XMLHttpRequest.prototype.getAllResponseHeaders = function () {
        var headers = [];
        for (var header in this.__responseHeader) {
            if (this.__responseHeader.hasOwnProperty(header)) {
                var value = this.__responseHeader[header];
                headers.push(header + "=" + value);
            }
        }
        return headers.join(';');
    };
    return XMLHttpRequest;
}(_XMLHttpRequest));
exports.default = XMLHttpRequest;


/***/ })
/******/ ]);
});