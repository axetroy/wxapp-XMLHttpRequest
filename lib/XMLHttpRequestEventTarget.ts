import EventTarget from './EventTarget';

class XMLHttpRequestEventTarget extends EventTarget {
  __onabortHandler = (event: Event) => {};
  __onerrorHandler = (event: Event) => {};
  __ontimeoutHandler = (event: Event) => {};
  get onabort() {
    return this.__onabortHandler || null;
  }
  set onabort(func) {
    this.__onabortHandler = func;
  }
  get onerror() {
    return this.__onerrorHandler || null;
  }
  set onerror(func) {
    this.__onerrorHandler = func;
  }
  get ontimeout() {
    return this.__ontimeoutHandler || null;
  }
  set ontimeout(func) {
    this.__ontimeoutHandler = func;
  }
}

export default XMLHttpRequestEventTarget;
