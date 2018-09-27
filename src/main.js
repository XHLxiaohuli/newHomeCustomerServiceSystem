// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import "babel-polyfill"
import $ from 'jquery'
import axios from 'axios';
import cookie from '@/assets/js/public/cookie'
// 通讯js
import '@/assets/js/public/im.js'
// 本地存储js
import '@/assets/js/public/indexedDB.js'

Vue.config.productionTip = false
Vue.prototype.$axios = axios;
Vue.prototype.$cookie = cookie

window.api = '120.24.102.187:8066';
//window.api = '47.107.77.220:8080';
// window.api = '192.168.5.167:8080';

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
