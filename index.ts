/**
 * Created by axetroy on 17-6-23.
 */
/// <reference path="./index.d.ts" />

import _XMLHttpRequest from './lib/XMLHttpRequest';

// http event
const EVENT_READY_STATE_CHANGE: string = 'readystatechange';
const EVENT_ERROR: string = 'error';
const EVENT_TIMEOUT: string = 'timeout';
const EVENT_ABORT: string = 'abort';

// http status code and text
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

type RESPONSE_TEXT = '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text';

function lowerCaseIfy(headers) {
  let output = {};
  for (let header in headers) {
    if (headers.hasOwnProperty(header)) {
      output[header.toLowerCase()] = headers[header];
    }
  }
  return output;
}

class XMLHttpRequest extends _XMLHttpRequest {
  private name: string = 'XMLHttpRequest';

  // not standard prop
  private __url: string;
  private __method: string = null;
  private __async: boolean = true;
  private __user: string;
  private __password: string;
  private __requestHeader: HttpHeader$ = {};
  private __responseHeader: HttpHeader$ = {};
  private __aborted: boolean = false;
  private __requestTask: RequestTask$ = null; // this is WeChat app's request task return, for abort the request
  private __readyState: number = this.UNSENT;
  private __onreadystatechangeHandler = (event: Event) => {};
  private __withCredentials: boolean = true; // default is true
  private __responseType: RESPONSE_TEXT | null = null;
  private __response: any = null;
  private __responseStatus: number = 0;
  private __timeout: number = 0;
  private __haveTimeout: boolean = false;
  private __requestDone: boolean = false;

  constructor() {
    super();
    this.addEventListener(EVENT_READY_STATE_CHANGE, ev => {
      this.__onreadystatechangeHandler(ev);
    });
    this.addEventListener(EVENT_TIMEOUT, ev => {
      this.__ontimeoutHandler(ev);
    });
    this.addEventListener(EVENT_ABORT, ev => {
      this.__onabortHandler(ev);
    });
    this.addEventListener(EVENT_ERROR, ev => {
      this.__onerrorHandler(ev);
    });
  }

  get readyState() {
    return this.__readyState;
  }

  get onreadystatechange() {
    return this.__onreadystatechangeHandler;
  }

  set onreadystatechange(callback) {
    this.__onreadystatechangeHandler = callback;
  }

  get withCredentials(): boolean {
    return this.__withCredentials;
  }

  set withCredentials(value: boolean) {
    this.__withCredentials = value;
  }

  get response() {
    return this.__response;
  }
  get responseText() {
    return typeof this.__response === 'object'
      ? JSON.stringify(this.__response)
      : this.__response;
  }
  get responseURL(): string {
    return this.__url;
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
  get responseType(): RESPONSE_TEXT {
    return this.__responseType;
  }

  /**
   * override mime type, not support yet
   * @param mimetype
   */
  overrideMimeType(mimetype: string) {
    if (this.readyState >= this.HEADERS_RECEIVED) {
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
    if (this.readyState >= this.OPENED) {
      this.abort();
      return;
    }
    this.__method = method;
    this.__url = url;
    this.__async = async;
    this.__user = user;
    this.__password = password;

    this.__readyState = this.OPENED;
    this.dispatchEvent(new Event(EVENT_READY_STATE_CHANGE));
  }

  /**
   * send data
   * @param data
   */
  send(data?: string | Object | ArrayBuffer | FormData | Document) {
    if (this.__readyState !== this.OPENED) {
      throw new Error(
        `Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.`
      );
    }

    // if the request have been aborted before send data
    if (this.__aborted === true) {
      return;
    }

    // can not resend
    if (this.__requestDone) {
      return;
    }

    let timer = null;

    if (this.timeout > 0) {
      timer = setTimeout(() => {
        if (this.__aborted === true) {
          return;
        }
        this.__haveTimeout = true;
        if (this.__requestTask) {
          this.__requestTask.abort();
        }
        this.dispatchEvent(new Event(EVENT_TIMEOUT));
      }, this.timeout);
    }

    this.__requestTask = this.__requestTask = wx.request({
      url: this.__url,
      method: this.__method,
      header: this.__requestHeader,
      data: data,
      dataType: 'json',
      success: res => {
        if (this.__haveTimeout || this.__aborted) return;
        timer && clearTimeout(timer);
        this.__requestDone = true;
        this.__requestTask = null;
        this.__responseStatus = res.statusCode;
        this.__responseHeader = lowerCaseIfy(res.header);
        this.__response = res.data === void 0 ? null : res.data;
        if (this.__responseStatus >= 400) {
          this.dispatchEvent(new Event(EVENT_ERROR));
        }
      },
      fail: res => {
        if (this.__haveTimeout || this.__aborted) return;
        timer && clearTimeout(timer);
        this.__requestDone = true;
        this.__requestTask = null;
        this.__responseStatus = res.statusCode;
        this.__responseHeader = lowerCaseIfy(res.header);
        this.__response = res.data === void 0 ? null : res.data;
        this.dispatchEvent(new Event(EVENT_ERROR));
      },
      complete: () => {
        if (this.__haveTimeout || this.__aborted) return;

        this.__readyState = this.HEADERS_RECEIVED;
        this.dispatchEvent(new Event(EVENT_READY_STATE_CHANGE));
        this.__readyState = this.LOADING;
        this.dispatchEvent(new Event(EVENT_READY_STATE_CHANGE));
        this.__readyState = this.DONE;
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
    if (this.__aborted || this.__requestDone) {
      return;
    }
    if (this.__requestTask) {
      this.__requestTask.abort();
    }
    this.__aborted = true;
    this.dispatchEvent(new Event(EVENT_ABORT));
  }

  /**
   * set request header
   * @param header
   * @param value
   */
  setRequestHeader(header, value) {
    // not call .open() yet
    if (this.readyState < this.OPENED) {
      throw new Error(
        `Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.`
      );
    }
    this.__requestHeader[header] = value + '';
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

export default XMLHttpRequest;
