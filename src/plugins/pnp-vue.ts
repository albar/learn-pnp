import { PluginObject } from 'vue';
import { SPRest, SPConfiguration } from '@pnp/sp';
import { IConfigOptions } from '@pnp/common';
import { DevelopmentProxyClient } from '@/libs/proxy';

declare module 'vue/types/vue' {
  export interface Vue {
    $sp: SPRest,
  }
}

export interface IPnpVuePluginOption {
  baseUrl?: string;
  restConfig?: IConfigOptions;
  spConfig: SPConfiguration;
}

export default {
  install(Vue, options: IPnpVuePluginOption) {
    const sp = new SPRest(options.restConfig, options.baseUrl);
    if (options.spConfig.sp) {
      const clientFactory = options.spConfig.sp.fetchClientFactory;
      if (typeof clientFactory === 'function') {
        const client = clientFactory();
        // eslint-disable-next-line no-param-reassign
        options.spConfig.sp.fetchClientFactory = () => client;
        if (client instanceof DevelopmentProxyClient) {
          let mounted = false;
          Vue.mixin({
            mounted() {
              if (mounted) return;
              client.init();
              mounted = true;
            },
          });
        }
      }
    }
    sp.setup(options.spConfig);

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$sp = sp;
  },
} as PluginObject<IPnpVuePluginOption>;
