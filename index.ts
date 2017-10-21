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
  private onreadystatechangeHandler = (event: any) => {};
  private withCredentials: boolean = false;
  private __responseType: string = '';
  private __response: any = null;
  private __responseStatus: number = 0;
  private __timeout: number = 0;

  constructor() {
    super();
    this.addEventListener('readystatechange', ev => {
      this.onreadystatechangeHandler(ev);
    });
    this.addEventListener('timeout', ev => {
      this.ontimeoutHandler(ev);
    });
    this.addEventListener('abort', ev => {
      this.onabortHandler(ev);
    });
    this.addEventListener('error', ev => {
      this.onabortHandler(ev);
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
    this.dispatchEvent(new Event('readystatechange'));
  }

  /**
   * send data
   * @param data
   */
  send(data?: string | Object) {
    this.__readyState = HEADERS_RECEIVED;
    this.dispatchEvent(new Event('readystatechange'));
    this.__readyState = LOADING;
    this.dispatchEvent(new Event('readystatechange'));

    let timer = null;
    let haveTimeout: boolean = false;

    if (this.timeout > 0) {
      timer = setTimeout(() => {
        haveTimeout = true;
        this.requestTask.abort();
        this.dispatchEvent(new Event('timeout'));
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
          this.dispatchEvent(new Event('error'));
        }
      },
      fail: res => {
        if (haveTimeout) return;
        timer && clearTimeout(timer);
        this.__responseStatus = res.statusCode;
        this.__responseHeader = res.header;
        this.__response = res.data === void 0 ? null : res.data;
        this.dispatchEvent(new Event('error'));
      },
      complete: () => {
        if (haveTimeout) return;
        this.__readyState = DONE;
        this.dispatchEvent(new Event('readystatechange'));
      }
    });
  }

  /**
   * abort the request after send
   */
  abort() {
    typeof this.requestTask === 'function' && this.requestTask();
    this.aborted = true;
    this.dispatchEvent(new Event('abort'));
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
