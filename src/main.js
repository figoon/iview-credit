import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import Axios from 'axios';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import util from '@/libs/util';
import ElementDataset from 'element-dataset';
// import Promise from 'es6-promise'

Vue.prototype.$http = Axios // 类似于vue-resource的调用方法
// http request 拦截器
Axios.interceptors.request.use(
  config => {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (store.state.app.token) {  
      config.headers.Authorization = `${store.state.app.token}`;
      config.headers.MicroToken = 'eyJhbGciOiJSUzI1NiJ9.eyJpZCI6InByb25nLXRlc3QiLCJleHAiOjM2NjQzNjkzNTV9.alwTkk7trULG23F21wUhO6bQDNBExoAYrn7sZ-tspsOhWZwvu4NRbtOjxRDjVGyPXF0Ms_gozIdpllj0N7j_lYN9HpZOMCN8eyLnAAJvHQKlCX60YOxSC3mAwn7FbWc6oQxx2F742O96oAZINSJMj5NqLV-OOjQ5XpMowx1Sn52IzSTkvATYLPqp9DmHUCcIBsz5sgEnHkWgrodH1KIbTrmWyoWofRxOashcXGPf0a5OIpHXj86sPMvPA91MAwjKnrYieUMKubwFWsV4ui6hpBWb1BlIirqhoZ3HZCl6fNPXMgntFRFGMUaiUNPVFejj6v0cLV74B43ZvHvH5RRyPA';
    }
    return config;
  },
  err => {
    return Promise.reject(err);
});

// Promise.polyfill();
ElementDataset();

Vue.use(VueI18n);
Vue.use(iView);

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted () {
    this.currentPageName = this.$route.name;
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList');
    this.$store.commit('initCachepage');
    // 权限菜单过滤相关
    this.$store.commit('updateMenulist');
    // iview-admin检查更新
    //util.checkUpdate(this);
  },
  created () {
    let tagsList = [];
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
    this.$store.commit('setTagsList', tagsList);
  }
});
