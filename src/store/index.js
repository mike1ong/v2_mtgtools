// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    lang: 'cn',
    count: 0
  },
  mutations: {
    increment: (state) => {
      const obj = state
      obj.count += 1
    },
    decrement: (state) => {
      const obj = state
      obj.count -= 1
    },
    switchLang: (state, lang) => {
      state.lang = lang
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
