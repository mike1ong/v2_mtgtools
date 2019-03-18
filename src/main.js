import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'
import App from '@/App'
import i18n from './i18n'
import store from '@/store'

var Fly = require('flyio/dist/npm/wx')
var fly = new Fly()
fly.config.baseURL = 'https://www.mtgtools.cn'
Vue.prototype.$http = fly
Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
Vue.prototype.$store = store

const app = new Vue({
  mpType: 'app',
  store,
  i18n,
  ...App
})
app.$mount()
