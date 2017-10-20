/**
 * Created by axetroy on 2017/6/28.
 */

interface RequestTask${
  abort():void
}

declare namespace wx {
  function request(config: RequestConfig$): RequestTask$;
}

interface Wx$ {
  request(config: RequestConfig$): void;
}

interface HttpHeader$ {
  [s: string]: string;
}

interface Response$ {
  data: any;
  errMsg: string;
  statusCode: number;
  header: HttpHeader$;
}

interface Config$ {
  url: string;
  method: string;
  data: Object | string;
  header: HttpHeader$;
  dataType: string;
}

interface RequestCallBack$ {
  success(data: Response$): void;
  fail(error: Response$): void;
  complete(): void;
}

interface RequestConfig$ extends RequestCallBack$, Config$ {}