class _EventTarget {
  private __listeners = {};
  constructor() {}
  addEventListener(type: string, callback: Function) {
    if (!(type in this.__listeners)) {
      this.__listeners[type] = [];
    }
    this.__listeners[type].push(callback);
  }
  removeEventListener(type: string, callback: Function) {
    if (!(type in this.__listeners)) {
      return;
    }
    const stack = this.__listeners[type];
    for (let i = 0, l = stack.length; i < l; i++) {
      if (stack[i] === callback) {
        stack.splice(i, 1);
        return this.removeEventListener(type, callback);
      }
    }
  }
  dispatchEvent(event: Event) {
    if (!(event.type in this.__listeners)) {
      return;
    }
    const stack = this.__listeners[event.type];
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

export default _EventTarget;
