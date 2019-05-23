// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    lang: 'zh',
    sysinfo: null,
    userinfo: {
      openid: ''
    },
    suspenddci: 'China',
    drafttimer: {
      cardsPerPack: 14,
      warnSeconds: 5
    },
    tiebreaker: {
      roundno: 0,
      playerlist: [],
      matchlist: []
    }
  },
  mutations: {
    switchLang: (state, lang) => {
      state.lang = lang
    },
    setSysinfo: (state, res) => {
      let param = {
        rHeight: 45,
        rMar: 2.5,
        rW: 110
      }
      if (res.system.substring(0, 3) === 'iOS') {
        param.rHeight = 40
        param.rMar = 0.5
        param.rW = 100
      }
      state.sysinfo = {
        pixelRatio: res.pixelRatio, // 系统像素比
        statusBarHeight: res.statusBarHeight, // 系统状态栏高度
        windowHeight: res.windowHeight,
        navHeight: res.pixelRatio * param.rHeight / res.pixelRatio, // 顶部导航栏高度
        headAreaHeight: res.pixelRatio * 35 / res.pixelRatio, // 顶部内容区域高度
        headAreaMarTop: res.pixelRatio * param.rMar / res.pixelRatio, // 顶部内容区域外边距
        headleftBoxW: res.windowWidth - res.pixelRatio * param.rW / res.pixelRatio, // 顶部内容左侧区域外边距
        headRightBoxW: res.pixelRatio * param.rW / res.pixelRatio, // 顶部内容右侧区域外边距
        containersHeight: res.windowHeight - (res.statusBarHeight + res.pixelRatio * param.rHeight / res.pixelRatio), // 页面内容区域高度
        SDKVersion: res.SDKVersion,
        fontSizeSetting: res.fontSizeSetting,
        language: res.language,
        model: res.model,
        platform: res.platform,
        system: res.system,
        version: res.version
      }
    },
    setUserInfo: (state, userinfo) => {
      state.userinfo = userinfo
    },
    setSuspenddci: (state, keyword) => {
      state.suspenddci = keyword
    },
    setDraftTimer: (state, res) => {
      state.drafttimer = res
    },
    setTiebreaker: (state, res) => {
      state.tiebreaker = res
    }
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => {
          return wx.getStorageSync(key)
        },
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: key => () => {}
      },
      reducer (val) {
        return val
      }
    }),
    createLogger()
  ]
})

export default store
