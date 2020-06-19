import { PluginObject } from 'vue';
import { SPRest, SPConfiguration } from '@pnp/sp';
import { ISPFXContext, IConfigOptions } from '@pnp/common';

declare module 'vue/types/vue' {
  export interface Vue {
    $sp: SPRest,
  }
}

export interface IPnpVuePluginOption {
  baseUrl?: string;
  restConfig?: IConfigOptions;
  spConfig: SPConfiguration | ISPFXContext;
}

export default {
  install(Vue, options: IPnpVuePluginOption) {
    const sp = new SPRest(options.restConfig, options.baseUrl);
    sp.setup(options.spConfig);

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$sp = sp;
  },
} as PluginObject<IPnpVuePluginOption>;
