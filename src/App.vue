<script>
import Vue from 'vue'
import mta from './utils/mta_analysis'
import store from '@/store'
import './style/iconfont.css'
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
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
.iconfont {
  font-size: 24px;
  color: #f0f0f0;
}
.avataricon {
  margin-left: 10px;
  margin-top: 5px;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
