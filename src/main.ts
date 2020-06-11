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
  created() {
    // do this once per page load
    sp.setup({
      sp: {
        fetchClientFactory: () => new SPRequestExecutorFetchClient(
          process.env.VUE_APP_SERVER_HOST,
        ),
      },
    });
  },
  mounted() {
    console.log(process.env);

    setTimeout(() => {
      // now make any calls you need using the configured client
      sp.web.select('Title')().then((w) => {
        console.log(`Web Title: ${w.Title}`);
      });
    }, 5000);
  },
}).$mount('#app');
