// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import { FormModel } from 'ant-design-vue'
// mock
import bootstrap from './core/bootstrap'
// 导入api生成器
import CreateApi from './api/index'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './global.less'
Vue.$api = Vue.prototype.$api = CreateApi
Vue.config.productionTip = false

Vue.use(FormModel)
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
