/**
 * Created by axetroy on 17-6-23.
 */
/// <reference path="./index.d.ts" />

class _EventTarget {
  private listeners = {};
  constructor() {}
  addEventListener(type, callback) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }
  removeEventListener(type, callback) {
    if (!(type in this.listeners)) {
      return;
    }
    const stack = this.listeners[type];
    for (let i = 0, l = stack.length; i < l; i++) {
      if (stack[i] === callback) {
        stack.splice(i, 1);
        return this.removeEventListener(type, callback);
      }
    }
  }
  dispatchEvent(event) {
    if (!(event.type in this.listeners)) {
      return;
    }
    const stack = this.listeners[event.type];
    Object.defineProperty(event, 'target', {
      value: this
    });
    Object.defineProperty(event, 'srcElement', {
      value: this
    });
    Object.defineProperty(event, 'currentTarget', {
      value: this
    });
    for (let i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
    }
  }
}

class XMLHttpRequestEventTarget extends _EventTarget {
  onabortHandler = (err: any) => {};
  onerrorHandler = (err: any) => {};
  ontimeoutHandler = (err: any) => {};
  get onabort() {
    return this.onabortHandler || null;
  }
  set onabort(func) {
    this.onabortHandler = func;
  }
  get onerror() {
    return this.onerrorHandler || null;
  }
  set onerror(func) {
    this.onerrorHandler = func;
  }
  get ontimeout() {
    return this.ontimeoutHandler || null;
  }
  set ontimeout(func) {
    this.ontimeoutHandler = func;
  }
}

const UNSENT: number = 0;
const OPENED: number = 1;
const HEADERS_RECEIVED: number = 2;
const LOADING: number = 3;
const DONE: number = 4;

const EVENT_READY_STATE_CHANGE: string = 'readystatechange';
const EVENT_ERROR: string = 'error';
const EVENT_TIMEOUT: string = 'timeout';
const EVENT_ABORT: string = 'abort';

const HTTP_CODE2TEXT = {
  100: 'Continue',
  101: 'Switching Protocol',
  102: 'Processing',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Multi-Status',
  226: 'IM Used',
  300: 'Multiple Choice',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: 'unused',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required'
};

class _XMLHttpRequest extends XMLHttpRequestEventTarget {
  public DONE = DONE;
  public LOADING = LOADING;
  public HEADERS_RECEIVED = HEADERS_RECEIVED;
  public OPENED = OPENED;
  public UNSENT = UNSENT;
  constructor() {
    super();
  }
}

function lowerCaseIfy(headers) {
  let output = {};
  for (let header in headers) {
    if (headers.hasOwnProperty(header)) {
      output[header.toLowerCase()] = headers[header];
    }
  }
  return output;
}

export default class XMLHttpRequest extends _XMLHttpRequest {
  private url: string;
  private method: string = 'GET';
  private async: boolean = true;
  private user: string;
  private password: string;
  private requestHeader: HttpHeader$ = {};
  private __responseHeader: HttpHeader$ = {};
  private aborted: boolean = false;
  private requestTask: RequestTask$ = null; // 微信小程序返回的questTask，用于取消请求任务
  private __readyState: number = UNSENT;
  private onreadystatechangeHandler = (event: any) => {};
  private withCredentials: boolean = false;
  private __responseType: string = '';
  private __response: any = null;
  private __responseStatus: number = 0;
  private __timeout: number = 0;
  private __haveTimeout: boolean = false;
  private __requestDone: boolean = false;

  constructor() {
    super();
    this.addEventListener(EVENT_READY_STATE_CHANGE, ev => {
      this.onreadystatechangeHandler(ev);
    });
    this.addEventListener(EVENT_TIMEOUT, ev => {
      this.ontimeoutHandler(ev);
    });
    this.addEventListener(EVENT_ABORT, ev => {
      this.onabortHandler(ev);
    });
    this.addEventListener(EVENT_ERROR, ev => {
      this.onerror(ev);
    });
  }

  get readyState() {
    return this.__readyState;
  }

  set onreadystatechange(callback) {
    this.onreadystatechangeHandler = callback;
  }

  get response() {
    return this.__response;
  }
  get responseText() {
    return typeof this.__response === 'object'
      ? JSON.stringify(this.__response)
      : this.__response;
  }
  get timeout(): number {
    return this.__timeout;
  }
  set timeout(millisecond: number) {
    this.__timeout = millisecond;
  }
  get status(): number {
    return this.__responseStatus;
  }
  get statusText(): string {
    return HTTP_CODE2TEXT[this.status] || 'unknown';
  }
  get responseType() {
    return this.__responseType;
  }

  /**
   * override mime type, not support yet
   * @param mimetype
   */
  overrideMimeType(mimetype) {
    if (this.readyState >= HEADERS_RECEIVED) {
      throw new Error(`Can not apply 'overrideMimeType' after send data`);
    }
  }

  /**
   * fake to open the server
   * @param method
   * @param url
   * @param async
   * @param user
   * @param password
   */
  open(method, url, async = true, user = null, password = null) {
    // if open over 2 time, then close connection
    if (this.readyState >= OPENED) {
      this.abort();
      return;
    }
    this.method = method;
    this.url = url;
    this.async = async;
    this.user = user;
    this.password = password;

    this.__readyState = OPENED;
    this.dispatchEvent(new Event(EVENT_READY_STATE_CHANGE));
  }

  /**
   * send data
   * @param data
   */
  send(data?: string | Object) {
    if (this.__readyState < OPENED) {
      throw new Error(
        `Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.`
      );
    }

    // if the request have been aborted before send data
    if (this.aborted === true) {
      return;
    }

    // can not resend
    if (this.__requestDone) {
      return;
    }

    let timer = null;

    if (this.timeout > 0) {
      timer = setTimeout(() => {
        if (this.aborted === true) {
          return;
        }
        this.__haveTimeout = true;
        if (this.requestTask) {
          this.requestTask.abort();
        }
        this.dispatchEvent(new Event(EVENT_TIMEOUT));
      }, this.timeout);
    }

    this.requestTask = this.requestTask = wx.request({
      url: this.url,
      method: this.method,
      header: this.requestHeader,
      data: data,
      dataType: 'json',
      success: res => {
        if (this.__haveTimeout || this.aborted) return;
        timer && clearTimeout(timer);
        this.__requestDone = true;
        this.requestTask = null;
        this.__responseStatus = res.statusCode;
        this.__responseHeader = lowerCaseIfy(res.header);
        this.__response = res.data === void 0 ? null : res.data;
        if (this.__responseStatus >= 400) {
          this.dispatchEvent(new Event(EVENT_ERROR));
        }
      },
      fail: res => {
        if (this.__haveTimeout || this.aborted) return;
        timer && clearTimeout(timer);
        this.__requestDone = true;
        this.requestTask = null;
        this.__responseStatus = res.statusCode;
        this.__responseHeader = lowerCaseIfy(res.header);
        this.__response = res.data === void 0 ? null : res.data;
        this.dispatchEvent(new Event(EVENT_ERROR));
      },
      complete: () => {
        if (this.__haveTimeout || this.aborted) return;

        this.__readyState = HEADERS_RECEIVED;
        this.dispatchEvent(new Event(EVENT_READY_STATE_CHANGE));
        this.__readyState = LOADING;
        this.dispatchEvent(new Event(EVENT_READY_STATE_CHANGE));
        this.__readyState = DONE;
        this.dispatchEvent(new Event(EVENT_READY_STATE_CHANGE));
      }
    });
  }

  /**
   * abort the request after send
   */
  abort() {
    // if the request have been aborted or have finish the quest
    // do nothing and return void
    if (this.aborted || this.__requestDone) {
      return;
    }
    if (this.requestTask) {
      this.requestTask.abort();
    }
    this.aborted = true;
    this.dispatchEvent(new Event(EVENT_ABORT));
  }

  /**
   * set request header
   * @param header
   * @param value
   */
  setRequestHeader(header, value) {
    // not call .open() yet
    if (this.readyState < OPENED) {
      throw new Error(
        `Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.`
      );
    }
    this.requestHeader[header] = value + '';
  }

  /**
   * get response header
   * @param header
   * @returns {null}
   */
  getResponseHeader(header) {
    const val = this.__responseHeader[header.toLowerCase()];
    return val !== undefined ? val : null;
  }

  /**
   * get all response header string
   * @returns {string}
   */
  getAllResponseHeaders() {
    const headers = [];
    const headersObject = lowerCaseIfy(this.__responseHeader);
    for (let header in headersObject) {
      if (headersObject.hasOwnProperty(header)) {
        const value = headersObject[header];
        headers.push(`${header.toLowerCase()}: ${value}`);
      }
    }
    return headers.join('\n');
  }
}
