import Vue from 'vue';
import { sp, SPRequestExecutorClient } from '@pnp/sp-addinhelpers';
import '@pnp/sp/webs';

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
        fetchClientFactory: () => new SPRequestExecutorClient(),
      },
    });
  },
  mounted() {
    console.log(process.env);

    sp.crossDomainWeb(
      process.env.VUE_APP_SERVER_HOST,
      process.env.VUE_APP_SERVER_HOST,
    ).get().then((w) => {
      console.log('zulul', w);
      console.log(JSON.stringify(w, null, 4));
    });
  },
}).$mount('#app');
