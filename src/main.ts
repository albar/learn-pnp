import Vue from 'vue';
import PortalVue from 'portal-vue';
import { NodeFetchClient } from '@pnp/nodejs';

import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import PnpVue from './plugins/pnp-vue';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

Vue.use(PortalVue);
Vue.use(PnpVue, {
  sp: {
    fetchClientFactory: () => new NodeFetchClient(),
  },
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
