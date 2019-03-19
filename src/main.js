import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'
import App from '@/App'
import i18n from './i18n'
import store from '@/store'
Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
console.log('main.js')
const app = new Vue({
  mpType: 'app',
  store,
  i18n,
  ...App
})
app.$mount()
