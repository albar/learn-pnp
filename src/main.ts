import Vue from 'vue';
import { sp } from '@pnp/sp';
import { SPFetchClient } from '@pnp/nodejs';
import '@pnp/sp/webs';

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
        fetchClientFactory: () => new SPFetchClient(
          process.env.VUE_APP_SERVER_HOST,
          process.env.VUE_APP_CLIENT_ID,
          process.env.VUE_APP_CLIENT_SECRET,
        ),
      },
    });

    // now make any calls you need using the configured client
    sp.web.select('Title')().then((w) => {
      console.log(`Web Title: ${w.Title}`);
    });
  },
}).$mount('#app');
