import Vue from 'vue';
import PortalVue from 'portal-vue';
import { NodeFetchClient } from '@pnp/nodejs';

import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import PnpVue from './plugins/pnp-vue';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import { DevelopmentProxyClient } from './libs/proxy';

Vue.config.productionTip = false;
Vue.config.devtools = true;

function fetchClientFactory() {
  return process.env.NODE_ENV === 'development'
    ? new DevelopmentProxyClient() : new NodeFetchClient();
}

Vue.use(PortalVue);
Vue.use(PnpVue, {
  baseUrl: process.env.VUE_APP_SERVER_HOST,
  spConfig: {
    sp: {
      fetchClientFactory,
    },
  },
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
