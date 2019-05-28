<script>
import Vue from 'vue'
import mta from './utils/mta_analysis'
import store from '@/store'
import { openSocket, doRequest } from './utils/websocket'
import './style/iconfont.css'
import './style/common.css'
var Fly = require('flyio/dist/npm/wx')
export default {
  created () {
    console.log('app created and cache logs by setStorageSync')
  },
  beforeCreate () { console.log('beforeCreate') },
  beforeMount () { console.log('beforeMount') },
  mounted () { console.log('mounted') },
  beforeUpdate () { console.log('beforeUpdate') },
  updated () { console.log('updated') },
  activated () { console.log('activated') },
  deactivated () { console.log('deactivated') },
  beforeDestroy () { console.log('beforeDestroy') },
  destroyed () { console.log('destroyed') },
  onLaunch (opt) {
    console.log('launch')
    // vue
    var fly = new Fly()
    fly.config.baseURL = 'https://www.mtgtools.cn'
    Vue.prototype.$http = fly
    Vue.prototype.$store = store
    // mta
    mta.App.init({
      'appID': '500674033',
      'eventID': '500674678',
      'statPullDownFresh': true,
      'lauchOpts': opt,
      'statShareApp': true,
      'statReachBottom': true
    })
    // getsysteminfo
    let res = this.$store.state.sysinfo
    if (!res) {
      res = wx.getSystemInfoSync()
      this.$store.commit('setSysinfo', res)
    }
    // getlang
    let lang = this.$store.state.lang || res.language || 'zh'
    if (lang !== 'en') {
      lang = 'zh'
    }
    this.$i18n.locale = lang
    // updateManager
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: this.$t('pub.common.newversion'),
        content: this.$t('pub.common.newversion_tips'),
        success (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function (err) {
      // 新版本下载失败
      console.log(err)
    })
    // websocket
    let checkSession = (userinfo) => {
      return new Promise(function (resolve, reject) {
        wx.checkSession({
          success () {
            doRequest('login', {
              from: 'miniapp',
              openid: userinfo.openid
            })
            resolve(true)
          },
          fail () {
            resolve(false)
          }
        })
      })
    }

    openSocket(async () => {
      let store = this.$store
      let userinfo = store.state.userinfo
      if (userinfo.openid) {
        if (await checkSession(userinfo)) {
          return
        }
      }
      wx.login({
        success (res) {
          doRequest('genSession', {
            from: 'miniapp',
            code: res.code
          }, (result) => {
            userinfo.openid = result.openid
            store.commit('setUserInfo', userinfo)
          })
        }
      })
    })
  }
}
</script>

<style>
</style>
