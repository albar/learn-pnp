import { PluginObject } from 'vue';
import { SPRest, SPConfiguration } from '@pnp/sp';
import { ISPFXContext } from '@pnp/common';

declare module 'vue/types/vue' {
  export interface Vue {
    $sp: SPRest,
  }
}

export default {
  install(Vue, options = {}) {
    const sp = new SPRest();
    sp.setup(options);

    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$sp = sp;
  },
} as PluginObject<SPConfiguration | ISPFXContext>;
