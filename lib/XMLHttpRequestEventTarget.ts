import EventTarget from './EventTarget';

class XMLHttpRequestEventTarget extends EventTarget {
  onabortHandler = (event: Event) => {};
  onerrorHandler = (event: Event) => {};
  ontimeoutHandler = (event: Event) => {};
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

export default XMLHttpRequestEventTarget;
