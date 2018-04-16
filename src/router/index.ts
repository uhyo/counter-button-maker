import Vue from 'vue';
import Router from 'vue-router';

import Index from '../pages/index.vue';

// Add the router middleware to Vue.
Vue.use(Router);

// Make a router.
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Index,
    },
  ],
});
