/* eslint-disable no-restricted-globals */
import { IHttpClientImpl, IFetchOptions, dateAdd } from '@pnp/common';

function generateUniqeId(): string {
  return Math.random().toString(36).substring(2);
}

declare type ProxyCallback = (response: Response) => void;

export class DevelopmentProxyClient implements IHttpClientImpl {
  private initialized = false;

  private listeners: { [key: string]: ProxyCallback } = {};

  fetch(url: string, options: IFetchOptions): Promise<Response> {
    return new Promise<Response>((resolve) => {
      if (!this.initialized) this.initializeEventListener();
      const id = generateUniqeId();
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
      parent.postMessage(JSON.stringify({
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

  initializeEventListener() {
    if (!window || this.initialized) return;

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

        const response = new Response(body, init);
        listener(response);
      } catch (e) {
        // console.log(e);
      }
    }, false);
    this.initialized = true;
  }
}

export default new DevelopmentProxyClient();
