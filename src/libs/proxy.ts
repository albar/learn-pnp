import { IHttpClientImpl, IFetchOptions } from '@pnp/common';

declare type ProxyCallback = (response: Response) => void;

interface IProxyResponse {
  id?: string;
  type?: string;
  response?: { body?: string; init?: ResponseInit; };
}

export class DevelopmentProxyClient implements IHttpClientImpl {
  private proxyUrl: string;

  private proxyWindow: Window | null = null;

  private listeners: { [key: string]: ProxyCallback } = {};

  private mounting: Promise<void>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private resolveMounting: () => void = () => { };

  constructor(proxyUrl: string) {
    this.proxyUrl = proxyUrl;
    this.mounting = new Promise((resolve) => {
      this.resolveMounting = resolve;
    });
  }

  async fetch(url: string, options: IFetchOptions): Promise<Response> {
    await this.mounting;
    return new Promise<Response>((resolve) => {
      const id = this.generateUniqeId();
      this.listeners[id] = resolve;

      const headers: { [key: string]: string | string[] } = {};
      if (options.headers && typeof options.headers.entries === 'function') {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of options.headers.entries()) {
          headers[key] = value;
        }
      }

      // eslint-disable-next-line no-unused-expressions
      this.proxyWindow?.postMessage(JSON.stringify({
        id,
        type: 'SP_PROXY_REQUEST',
        request: {
          url,
          options: {
            ...options,
            headers,
          } as RequestInit,
        },
      }), '*');
    });
  }

  generateUniqeId(): string {
    const id = Math.random().toString(36).substring(2);
    if (!this.listeners[id]) return id;
    return this.generateUniqeId();
  }

  init(): void {
    const frame = document.createElement('iframe');
    frame.src = this.proxyUrl;
    frame.style.display = 'none';

    const onProxyReady = (event: MessageEvent) => {
      if (event.data === 'SP_PROXY_READY') {
        window.removeEventListener('message', onProxyReady);
        this.proxyWindow = frame.contentWindow;
        this.resolveMounting();
      }
    };

    window.addEventListener('message', onProxyReady);
    window.addEventListener('message', (event: MessageEvent) => {
      if (!event.data) return;

      let data: IProxyResponse = {};

      try {
        data = JSON.parse(event.data);
      } catch (e) {
        // parse error possibly because of the event is
        // not from our expected response
        return;
      }

      if (data.type !== 'SP_PROXY_RESPONSE'
        || !data.id
        || !data.response
        || !Object.prototype.hasOwnProperty.call(this.listeners, data.id)
      ) return;

      const listener = this.listeners[data.id];
      delete this.listeners[data.id];

      // eslint-disable-next-line prefer-const
      let { body, init } = data.response;

      if (init?.status === 204) {
        init.status = 200;
      }

      listener(new Response(body, init));
    }, false);

    document.body.appendChild(frame);
  }
}

export default DevelopmentProxyClient;
