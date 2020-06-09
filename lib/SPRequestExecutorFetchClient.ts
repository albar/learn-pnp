/* eslint-disable  @typescript-eslint/no-explicit-any */
import { IHttpClientImpl, IFetchOptions } from '@pnp/common';

declare let SP: any;
type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void;

function buildHeader(headers: any) {
  const header = new Headers();
  if (headers) {
    // TODO: map headers to Headers object
  }
  return header;
}

export class SPRequestExecutorFetchClient implements IHttpClientImpl {
  private siteUrl: string;

  private client: any;

  constructor(siteUrl: string) {
    this.siteUrl = siteUrl;
    this.client = new SP.RequestExecutor(siteUrl);
  }

  fetch(url: string, options: IFetchOptions): Promise<Response> {
    let resolve: PromiseResolve<Response>;

    const promise = new Promise<Response>((r) => {
      resolve = r;
    });

    console.log('requesting', url, options);

    this.client.executeAsync({
      url: `${this.siteUrl}/${url}`,
      ...options,
      success: (data: any) => {
        console.log('success', data);
        return resolve(new Response(data.body, data));
      },
      error: (data: any, status: number, statusText: string) => {
        console.log('error', data);
        return resolve(new Response(data.body, {
          status,
          statusText,
          headers: buildHeader(data.headers),
        }));
      },
    });

    return promise;
  }
}

export default SPRequestExecutorFetchClient;
