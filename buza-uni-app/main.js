import App from './App'
import * as http from './utils/api.js';
import * as utils from './utils/utils/utils.js';
import config from '@/config.js';


// #ifndef VUE3
import Vue from 'vue'
Vue.prototype.$http = http;
Vue.prototype.$utils = utils;
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif