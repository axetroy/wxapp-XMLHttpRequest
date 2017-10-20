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
    event.target = this;
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
  private onreadystatechangeHandler = () => {};
  private withCredentials: boolean = false;
  private __responseType: string = '';
  private __response: any = null;
  private __responseStatus: number = 0;
  private __timeout: number = 0;

  constructor() {
    super();
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
  get status() {
    return this.__responseStatus;
  }
  get statusText() {
    return this.status + '';
  }
  get responseType() {
    return this.__responseType;
  }

  // method
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
    this.method = method;
    this.url = url;
    this.async = async;
    this.user = user;
    this.password = password;
  }

  /**
   * send data
   * @param data
   */
  send(data?: string | Object) {
    this.__readyState = UNSENT;
    this.onreadystatechangeHandler();
    this.__readyState = OPENED;
    this.onreadystatechangeHandler();
    this.__readyState = HEADERS_RECEIVED;
    this.onreadystatechangeHandler();
    this.__readyState = LOADING;
    this.onreadystatechangeHandler();

    let timer = null;
    let haveTimeout: boolean = false;

    if (this.timeout > 0) {
      timer = setTimeout(() => {
        haveTimeout = true;
        this.requestTask.abort();
        this.ontimeoutHandler(new Error(`Timeout ${this.timeout} ms`));
      }, this.timeout);
    }

    this.requestTask = this.requestTask = wx.request({
      url: this.url,
      method: this.method,
      header: this.requestHeader,
      data: data,
      dataType: 'json',
      success: res => {
        if (haveTimeout) return;
        timer && clearTimeout(timer);
        this.__responseStatus = res.statusCode;
        this.__responseHeader = res.header;
        this.__response = res.data === void 0 ? null : res.data;
        if (this.__responseStatus >= 400) {
          this.onerrorHandler(new Error(res.errMsg));
        }
      },
      fail: res => {
        if (haveTimeout) return;
        timer && clearTimeout(timer);
        this.__responseStatus = res.statusCode;
        this.__responseHeader = res.header;
        this.__response = res.data === void 0 ? null : res.data;
        this.onerrorHandler(new Error(res.errMsg));
      },
      complete: () => {
        if (haveTimeout) return;
        this.__readyState = DONE;
        this.onreadystatechangeHandler();
      }
    });
  }

  /**
   * abort the request after send
   */
  abort() {
    typeof this.requestTask === 'function' && this.requestTask();
    this.aborted = true;
  }

  /**
   * set request header
   * @param header
   * @param value
   */
  setRequestHeader(header, value) {
    this.requestHeader[header] = value + '';
  }

  /**
   * get response header
   * @param header
   * @returns {null}
   */
  getResponseHeader(header) {
    const val = this.__responseHeader[header];
    return val !== undefined ? val : null;
  }

  /**
   * get all response header string
   * @returns {string}
   */
  getAllResponseHeaders() {
    const headers = [];
    for (let header in this.__responseHeader) {
      if (this.__responseHeader.hasOwnProperty(header)) {
        const value = this.__responseHeader[header];
        headers.push(`${header}=${value}`);
      }
    }
    return headers.join(';');
  }
}
