import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { message, test } from '@/data';
import myAlert from '@/func';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

myAlert(message);
myAlert(test);
