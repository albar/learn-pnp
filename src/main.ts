import Vue from 'vue';
import { sp } from '@pnp/sp';
import '@pnp/sp/webs';

import { SPRequestExecutorFetchClient } from '../lib/SPRequestExecutorFetchClient';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
  mounted() {
    console.log(process.env);

    // do this once per page load
    sp.setup({
      sp: {
        fetchClientFactory: () => new SPRequestExecutorFetchClient(
          process.env.VUE_APP_SERVER_HOST,
        ),
      },
    });

    // now make any calls you need using the configured client
    sp.web.select('Title')().then((w) => {
      console.log(`Web Title: ${w.Title}`);
    });
  },
}).$mount('#app');
