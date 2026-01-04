interface RequestQueries extends Record<string, unknown> {}

interface RequestBody extends Record<string, unknown> {}

interface RequestHeaders extends Record<string, string> {}

interface RestData {
  code: number;
  message: string;
  body?: Record<string, unknown>;
}

interface RequestContext {
  request: {
    method: string;
    pathname: string;
    params: Record<string, string>;
    queries: RequestQueries;
    body: RequestBody;
    headers: RequestHeaders;
  };
  body: RestData;
}

type RouteFunction = (ctx: RequestContext, next: () => void) => void;

export class Client {
  verb(
    method: string,
    pathname: string,
    queries?: RequestQueries,
    body?: RequestBody,
    headers?: RequestHeaders
  ): Promise<unknown>;
}

export class Server {
  route(method: string, path: string, ...middleware: RouteFunction[]): void;
}
