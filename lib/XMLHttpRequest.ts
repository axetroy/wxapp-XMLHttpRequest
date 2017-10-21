import XMLHttpRequestEventTarget from './XMLHttpRequestEventTarget';

const UNSENT: number = 0;
const OPENED: number = 1;
const HEADERS_RECEIVED: number = 2;
const LOADING: number = 3;
const DONE: number = 4;

class XMLHttpRequest extends XMLHttpRequestEventTarget {
  public DONE = DONE;
  public LOADING = LOADING;
  public HEADERS_RECEIVED = HEADERS_RECEIVED;
  public OPENED = OPENED;
  public UNSENT = UNSENT;
}

export default XMLHttpRequest;
