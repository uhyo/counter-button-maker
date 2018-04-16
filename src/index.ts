import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import App from './layout/app.vue';
import store from './store';
import router from './router';

// sync the Vuex store and router.
const unsync = sync(store, router);

const app = new App({
  router,
  store,
});

export { app, router, store };
