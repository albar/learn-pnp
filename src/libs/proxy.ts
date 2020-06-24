import { IHttpClientImpl, IFetchOptions } from '@pnp/common';

declare type ProxyCallback = (response: Response) => void;

export class DevelopmentProxyClient implements IHttpClientImpl {
  private proxyUrl: string;

  private frame: HTMLIFrameElement | null = null;

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
      this.listeners[id] = (response) => {
        resolve(response);
      };
      const headers: { [key: string]: string | string[] } = {};
      if (options.headers && typeof options.headers.entries === 'function') {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of options.headers.entries()) {
          headers[key] = value;
        }
      }
      // eslint-disable-next-line no-unused-expressions
      this.frame?.contentWindow?.postMessage(JSON.stringify({
        id,
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

  init() {
    const onMounted = (event: MessageEvent) => {
      if (event.data === 'Sp-Proxy-Ready') {
        this.resolveMounting();
        window.removeEventListener('message', onMounted);
      }
    };

    window.addEventListener('message', onMounted);

    window.addEventListener('message', (event: MessageEvent) => {
      try {
        if (!event.data) return;
        const data = JSON.parse(event.data);
        const listener = this.listeners[data.id];
        if (!listener) return;
        delete this.listeners[data.id];

        // eslint-disable-next-line prefer-const
        let { body, init } = data;

        if (init.status === 204) {
          init.status = '200';
        }

        listener(new Response(body, init));
      } catch (e) {
        // console.log(e);
      }
    }, false);

    this.frame = document.createElement('iframe');
    this.frame.src = this.proxyUrl;
    this.frame.style.display = 'none !important';
    document.body.appendChild(this.frame);
  }
}

export default DevelopmentProxyClient;
